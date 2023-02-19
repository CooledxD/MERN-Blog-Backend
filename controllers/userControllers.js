import { unlink } from 'node:fs/promises'
import { fileURLToPath } from 'url';

import User from '../models/userModel.js'

// Back __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Update user avatar
export const updateAvatar = async(req, res) => {
  try {
    // Request
    const { userId } = req
    const newAvatar = req.file ? req.file.filename : ''

    // Database
    const user = await User.findById(userId)

    // If the user has an avatar, then delete it
    if (user.avatar) {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
      unlink(`${__dirname}/../uploads/${user.avatar}`)
    }

    // Adding a new avatar to the model
    user.avatar = newAvatar

    // Saving the model
    await user.save()

    res.status(200).json({
      avatar: newAvatar
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Getting user data
export const getUser = async(req, res) => {
  try {
    // Request
    const { userId } = req

    // Database
    const { username, avatar, posts, likes } = await User.findById(userId)

    res.status(200).json({
      user: {
        username,
        avatar,
        posts,
        likes
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}