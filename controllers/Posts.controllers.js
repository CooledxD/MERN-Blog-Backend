import Post from '../models/Post.js'
import User from '../models/User.js'

// Back __dirname
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title } = req.body
    const { text } = req.body
    const { userId } = req
    const name = await User.findById(userId)

    if(req.files) {
      const fileName = Date.now().toString() + req.files.image.name

      req.files.image.mv(path.join(__dirname, '../uploads', fileName))

      const newPost = new Post({
        title,
        text,
        image: fileName,
        author: userId,
        username: name.username
      })

      await newPost.save()
      await User.findByIdAndUpdate(userId, {
        $push: { posts: newPost }
      })

      return res.status(201).json({
        newPost,
        message: 'Статья успешно создана.'
      })
    }

    const newPost = new Post({
      title,
      text,
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

    list.sort((a, b) => b.createdAt - a.createdAt)

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
    const { title } = req.body
    const { text } = req.body
    const { id } = req.body
    const post = await Post.findById(id)

    if(req.files) {
      const fileName = Date.now().toString() + req.files.image.name

      req.files.image.mv(path.join(__dirname, '../uploads', fileName))

      post.image = fileName || ''
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