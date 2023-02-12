import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'

// Register
export const register = async (req, res) => {
  try {
    // Request
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    const { email } = req.body
    const { avatar } = req.body

    // Database
    const isUsedEmail = await User.findOne({ email })
    const isUsedLogin = await User.findOne({ username })

    // Validation
    if (isUsedLogin) {
      return res.status(409).json({
        message: 'Данный логин уже существует.'
      })
    }

    if (isUsedEmail) {
      return res.status(409).json({
        message: 'Данный email уже используется.'
      })
    }

    // Create password hash
    const hash = bcrypt.hashSync(password, 10)

    // Create user model
    const newUser = new User({
      username,
      password: hash,
      email,
      avatar
    })

    // Create token
    const token = jwt.sign(
      {
        id: newUser._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    // Save model user in database
    await newUser.save()

    res.status(201).json({
      token,
      message: 'Регистрация прошла успешно.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Не удалось зарегистрироваться.'
    })
  }
}

// Login
export const login = async (req, res) => {
  try {
    // Request
    const { username } = req.body
    const { password } = req.body

    // Database
    const isUsedLogin = await User.findOne({ username })

    // Validation
    const isValidPass = await bcrypt.compare(password, isUsedLogin.password)

    if (!isUsedLogin || !isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: isUsedLogin._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    res.status(200).json({
      token,
      message: 'Успешная авторизация.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Ошибка авторизации.'
    })
  }
}

// Get me
export const getMe = async (req, res) => {
  try {
    // Databse
    const isValidId = await User.findById(req.userId)

    // Validation
    if (!isValidId) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: isValidId._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    res.status(200).json({
      token
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Нет доступа.'
    })
  }
}