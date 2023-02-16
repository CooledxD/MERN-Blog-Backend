import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { sendActivationEmail } from '../utils/sendEmail.js'
import { createActivationToken, createAccessToken, createRefreshToken } from '../utils/creatingTokens.js'

import User from '../models/userModel.js'

// Register
export const register = async (req, res) => {
  try {
    // Request
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    const { email } = req.body

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({
        message: 'Please fill all the fields'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password length must be atleast 8 characters'
      })
    }

    if (!email) {
      return res.status(400).json({
        message: 'Invalid email'
      })
    }

    const isUsedEmail = await User.findOne({ email })
    const isUsedLogin = await User.findOne({ username })

    if (isUsedLogin) {
      return res.status(409).json({
        message: 'This login is already in use'
      })
    }

    if (isUsedEmail) {
      return res.status(409).json({
        message: 'This email is already in use'
      })
    }

    // Create password hash
    const hashPassword = await bcrypt.hash(password, 8)

    // Create user model
    const newUser = {
      username,
      password: hashPassword,
      email
    }

    // Create activation token
    const activationToken = createActivationToken(newUser)

    // Creating a URL to send an email with account activation
    const url = `${process.env.CLIENT_URL}/auth/activate-account/${activationToken}`

    // Creating and sending an account activation email
    await sendActivationEmail({email, url})

    res.status(200).json({
      message: 'Please click on the activation link we sent to your email to complete your registration'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong'
    })
  }
}

// Activation account
export const activateAccount = async (req, res) => {
  try {
    // Request
    const { activationToken } = req.body

    // Validation token
    const newUserData = jwt.verify(activationToken, process.env.JWT_ACTIVATION_SECRET)

    // Validation
    const isUsedEmail = await User.findOne({ email: newUserData.email })

    if (isUsedEmail) {
      return res.status(400).json({
        message: 'This email already exists'
      })
    }

    // Create user model
    const newUser = new User({
      username: newUserData.username,
      password: newUserData.password,
      email: newUserData.email
    })

    // Save model user in database
    await newUser.save()

    res.status(201).json({
      message: 'Account has been activated'
    })
  } catch (error) {
    console.log(error)

    res.status(400).json({
      message: 'Wrong credentials'
    })
  }
}

// Login
export const login = async (req, res) => {
  try {
    // Request
    const { username } = req.body
    const { password } = req.body

    // Validation
    const isUsedLogin = await User.findOne({ username })
    const isValidPass = await bcrypt.compare(password, isUsedLogin.password)

    if (!isUsedLogin || !isValidPass) {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }

    // Create token
    const refreshToken = createRefreshToken({ id: isUsedLogin._id })

    // Adding cookies in response
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })

    res.status(200).json({
      message: 'Login successful'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Authorization error'
    })
  }
}

// Renew access token
export const renewAccessToken = async (req, res) => {
  try {
    // Request
    const refreshToken = req.cookies ? req.cookies.refreshToken : ''

    // Validation
    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token not found'
      })
    }

    // Validatiopn token
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Create access token
    const accessToken = createAccessToken({ id: user.id })

    res.status(200).json({
      accessToken
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Refresh token not valid'
    })
  }
}

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true
    })

    res.status(200).json({
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}