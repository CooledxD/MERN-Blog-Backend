import Comment from "../models/commentModel.js";
import Post from '../models/postModel.js'
import User from "../models/userModel.js";

// Create comment
export const createComment = async (req, res) => {
  try {
    // Request
    const { postId } = req.body
    const { authorAvatar } = req.body
    const comment = req.body.comment.trim()
    const { userId } = req

    // Databse
    const { username } = await User.findById(userId)

    // Validation
    if (!comment) {
      return res.status(400).json({
        message: 'Комментарий не может быть пустым.'
      })
    }

    // Create comment model
    const newComment = new Comment({
      comment,
      post: postId,
      author: userId,
      username,
      authorAvatar
    })

    // Save model user in database
    await newComment.save()

    // Adding the comment id to the post document
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id }
    })

    res.status(201).json(newComment)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}

// Remove comment
export const removeComment = async (req, res) => {
  try {
    // Request
    const { postId } = req.body
    const { commentId } = req.body

    // Database
    const comment = await Comment.findByIdAndDelete(commentId)

    // Validation
    if(!comment) {
      return res.status(404).json({
        message: 'Такого поста не существует.'
      })
    }

    // Deleting the comment id from the post document.
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }
    })

    res.status(204).json({
      message: 'Комментарий был удален.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Что то пошло не так.',
    })
  }
}