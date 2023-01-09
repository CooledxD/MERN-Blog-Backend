import User from '../models/User.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register
export const register = async (req, res) => {
  try {
    const { username } = req.body
    const { password } = req.body
    const { email } = req.body
    const { avatar } = req.body
    const isUsedLogin = await User.findOne({ username })

    if (isUsedLogin) {
      return res.status(409).json({
        message: 'Данный логин уже существует.'
      })
    }

    const salt = bcrypt.genSaltSync(7)
    const hash = bcrypt.hashSync(password, salt)

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
      newUser,
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
      token,
      isUsedLogin,
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
    const isValidId = await User.findOne(req.userId)

    if (!isValidId) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    res.json({
      isValidId
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: 'Нет доступа.'
    })
  }
}