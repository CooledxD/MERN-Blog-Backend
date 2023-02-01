import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js'

// Register
export const register = async (req, res) => {
  try {
    const username = req.body.username.trim()
    const password = req.body.password.trim()
    const { email } = req.body
    const { avatar } = req.body
    const isUsedEmail = await User.findOne({ email })
    const isUsedLogin = await User.findOne({ username })

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

    const hash = bcrypt.hashSync(password, 10)

    const newUser = new User({
      username,
      password: hash,
      email,
      avatar
    })

    const token = jwt.sign(
      {
        id: newUser._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    await newUser.save()

    res.status(201).json({
      user: {
        username: newUser.username,
        avatar: newUser.avatar,
        posts: newUser.posts
      },
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
    const { username } = req.body
    const { password } = req.body
    const isUsedLogin = await User.findOne({ username })
    const isValidPass = await bcrypt.compare(password, isUsedLogin.password)

    if (!isUsedLogin || !isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        id: isUsedLogin._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    res.json({
      user: {
        username: isUsedLogin.username,
        avatar: isUsedLogin.avatar,
        posts: isUsedLogin.posts
      },
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
    const isValidId = await User.findById(req.userId)

    if (!isValidId) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const token = jwt.sign(
      {
        id: isValidId._id
      },
      process.env.JWT_SECRED,
      {
        expiresIn: '30d'
      }
    )

    res.json({
      user: {
        username: isValidId.username,
        avatar: isValidId.avatar,
        posts: isValidId.posts
      },
      token
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Нет доступа.'
    })
  }
}