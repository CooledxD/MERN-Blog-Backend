import { unlink } from 'node:fs/promises'
import { dirname } from 'node:path/win32'
import { fileURLToPath } from 'url';

import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import Comment from '../models/commentModel.js'

// Back __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

// Create Post
export const createPost = async (req, res) => {
  try {
    const title = req.body.title.trim()
    const text = req.body.text.trim()
    const image = req.file ? req.file.filename : ''
    const { userId } = req
    const name = await User.findById(userId)

    const newPost = new Post({
      title,
      text,
      image,
      author: userId,
      username: name.username
    })

    await newPost.save()

    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost }
    })

    res.status(201).json({
      newPost,
      message: 'Статья успешно создана.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt')
    const popularPosts = await Post.find().sort('-views').limit(5)

    if(!posts) {
      return res.status(404).json({ message: 'Постов нет' })
    }

    res.status(200).json({
      posts,
      popularPosts
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.'
    })
  }
}

// Get Post By Id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    })

    res.status(200).json(post)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.'
    })
  }
}

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const list = await Promise.all(
      user.posts.map(post => {
        return Post.findById(post._id)
      })
    )

    list?.sort((a, b) => b.createdAt - a.createdAt)

    res.status(200).json(list)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  } 
}

// Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)

    if(!post) {
      return res.status(404).json({
        message: 'Такого поста не существует.'
      })
    }

    if (post.image) {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
      unlink(`${__dirname}/../uploads/${post.image}`)
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: post._id }
    })

    res.status(204).json({
      message: 'Пост был удален.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}

// Update Post
export const updatePost = async (req, res) => {
  try {
    const title = req.body.title.trim()
    const text = req.body.text.trim()
    const image = req.file ? req.file.filename : ''
    const { id } = req.body
    const post = await Post.findById(id)

    if(image) {
      post.image = image
    }

    post.title = title
    post.text = text

    await post.save()

    res.status(204).json(post)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}

// Get post comments
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment)
      })
    )

    res.status(200).json(list)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}