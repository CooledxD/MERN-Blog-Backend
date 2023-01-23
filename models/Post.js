import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    views: {
      type: Number,
      default: 0
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    },
    comments: [{
      type: mongoose.Types.ObjectId,
      ref: 'Comment'
    }],
    tags: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Post', PostSchema)