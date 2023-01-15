import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    avatar: {
      type: String
    },
    
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password
        delete ret._id
      }
    }
  }
)

export default mongoose.model('User', UserSchema)