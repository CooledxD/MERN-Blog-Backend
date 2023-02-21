import Comment from "../models/commentModel.js";
import Post from '../models/postModel.js'
import User from "../models/userModel.js";

// Create comment
export const createComment = async (req, res) => {
  try {
    // Request
    const { postId, authorAvatar, comment } = req.body
    const { userId } = req

    // Database
    const { username } = await User.findById(userId)

    // Create comment model
    const newComment = new Comment({
      comment,
      post: postId,
      author: userId,
      username,
      authorAvatar
    })

    // Save model comment in database
    await newComment.save()

    // Adding the comment id to the post document
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id }
    })

    res.status(201).json({
      newComment
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}

// Remove comment
export const removeComment = async (req, res) => {
  try {
    // Request
    const { postId, commentId } = req.body

    // Remove comment
    await Comment.findByIdAndDelete(commentId)

    // Deleting the comment id from the post document.
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }
    })

    res.status(204).json()
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Something went wrong',
    })
  }
}