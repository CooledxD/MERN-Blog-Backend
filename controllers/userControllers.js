import { unlink } from 'node:fs/promises'
import { dirname } from 'node:path/win32'
import { fileURLToPath } from 'url';

import User from '../models/userModel.js'

// Back __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

export const updateAvatar = async(req, res) => {
  try {
    const { userId } = req
    const newAvatar = req.file ? req.file.filename : ''
    const user = await User.findById(userId)

    if (user.avatar) {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
      unlink(`${__dirname}/../uploads/${user.avatar}`)
    }

    user.avatar = newAvatar

    await user.save()

    res.status(200).json({
      avatar: newAvatar
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}

export const getUser = async(req, res) => {
  try {
    const { userId } = req
    const user = await User.findById(userId)

    res.status(200).json({
      user: {
        username: user.username,
        avatar: user.avatar,
        posts: user.posts
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Нет доступа.',
    })
  }
}