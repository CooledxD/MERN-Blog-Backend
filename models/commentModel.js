import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: true
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    },
    authorAvatar: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Comment', CommentSchema)