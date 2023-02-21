import bcrypt from 'bcrypt'

import { sendActivationEmail } from '../utils/sendEmail.js'
import { createActivationToken, createAccessToken, createRefreshToken } from '../utils/creatingTokens.js'

import User from '../models/userModel.js'

// Register
export const register = async (req, res) => {
  try {
    // Request body
    const { username, password, email } = req.body

    // Create password hash
    const hashPassword = await bcrypt.hash(password, 8)

    // Create activation token
    const activationToken = createActivationToken({
      username,
      password: hashPassword,
      email
    })

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
    const { username, password, email } = req.body

    // Save model user in database
    await User.create({
      username,
      password,
      email
    })

    res.status(201).json({
      message: 'Account has been activated'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong'
    })
  }
}

// Login
export const login = async (req, res) => {
  try {
    // Request body
    const { user } = req.body

    // Create token
    const refreshToken = createRefreshToken({ id: user._id })

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
      message: 'Something went wrong'
    })
  }
}

// Renew access token
export const renewAccessToken = async (req, res) => {
  try {
    const { tokenData } = req.body

    // Create access token
    const accessToken = createAccessToken({ id: tokenData.id })

    res.status(200).json({
      accessToken
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong'
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