import { unlink } from 'node:fs/promises'
import { fileURLToPath } from 'url';

import Post from '../models/postModel.js'
import User from '../models/userModel.js'
import Comment from '../models/commentModel.js'

// Back __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Create Post
export const createPost = async (req, res) => {
  try {
    // Request
    const { title, text } = req.body
    const image = req.file ? req.file.filename : ''
    const { userId } = req

    // Database
    const name = await User.findById(userId)

    // Create post model
    const newPost = new Post({
      title,
      text,
      image,
      author: userId,
      username: name.username
    })

    // Save model post in database
    await newPost.save()

    // Adding the post id to the user's document
    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost }
    })

    res.status(201).json({
      newPost,
      message: 'The article was successfully created'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Failed to create an article',
    })
  }
}

// Remove post
export const removePost = async (req, res) => {
  try {
    // Database
    const post = await Post.findByIdAndDelete(req.params.postId)

    if (post.image) {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
      unlink(`${__dirname}/../uploads/${post.image}`)
    }

    // Deleting the post id from the user's document
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: post._id }
    })

    // Remove comments
    post.comments.forEach( async (id) => {
      await Comment.findByIdAndDelete(String(id))
    })

    // Remove likes
    post.likes.forEach( async (username) => {
      await User.findOneAndUpdate({ username: username }, {
        $pull: { likes: post._id }
      })
    })

    res.status(200).json({
      message: 'The post has been deleted'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Update Post
export const updatePost = async (req, res) => {
  try {
    // Request
    const { title, text } = req.body
    const image = req.file ? req.file.filename : ''

    // Database
    const post = await Post.findById(req.params.postId)

    // Updating the image of the post
    if (req.body.image) {
      // If the old image is preserved
      post.image = req.body.image
    } else {
      // Otherwise we delete the old image
      if (post.image) {
        /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
        unlink(`${__dirname}/../uploads/${post.image}`)
      }

      // If a new image is saved
      if(image) {
        post.image = image
      }
    }

    // Adding new ones title and text
    post.title = title
    post.text = text

    // Save post
    await post.save()

    res.status(200).json(post)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Get Post By Id
export const getPostById = async (req, res) => {
  try {
    // Database
    const post = await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { views: 1 }
    })

    res.status(200).json(post)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong'
    })
  }
}

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    // Database
    const posts = await Post.find().sort('-createdAt')
    const popularPosts = await Post.find().sort('-views').limit(5)

    res.status(200).json({
      posts,
      popularPosts
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong'
    })
  }
}

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    // Database
    const user = await User.findById(req.userId)

    // Get user posts
    const list = await Promise.all(
      user.posts.map(post => {
        return Post.findById(post._id)
      })
    )

    // Sorting posts by creation date
    list?.sort((a, b) => b?.createdAt - a?.createdAt)

    res.status(200).json(list)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  } 
}

// Get post comments
export const getPostComments = async (req, res) => {
  try {
    const { post } = req.body

    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment)
      })
    )

    res.status(200).json(list)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Adding user's like to post
export const addUserLikePost = async (req, res) => {
  try {
    // Request
    const { username } = req.body
    const { userId } = req

    // Adding the username of the user to the likes field in the post document
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { likes: username }
    })

    // Adding the post id to the likes field in the user's document
    await User.findByIdAndUpdate(userId, {
      $push: { likes: req.params.postId }
    })

    res.status(200).json({
      message: 'success'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Remove user's like to post
export const removeUserLikePost = async (req, res) => {
  try {
    // Request
    const { username } = req.body
    const { userId } = req

    // Removing the user name of the user from the likes field in the post document
    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { likes: username }
    })

    // Removing the post id from the likes field in the user's document
    await User.findByIdAndUpdate(userId, {
      $pull: { likes: req.params.postId }
    })

    res.status(200).json({
      message: 'success'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}