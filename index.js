import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'

import authRoute from './routes/authRoutes.js'
import postRoute from './routes/postsRoutes.js'
import commentRoute from './routes/commentsRoutes.js'

dotenv.config()
const app = express()

// Constants
const PORT = process.env.PORT

// Middleware
app.use(cors())
app.use(fileUpload())
app.use(express.static('uploads'))
app.use(express.json())

// Routes
app.use('/auth', authRoute)
app.use('/posts', postRoute)
app.use('/comments', commentRoute)



// Start
async function start() {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(`mongodb://127.0.0.1:27017/mern-blog`)

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()