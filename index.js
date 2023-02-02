import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import authRoute from './routes/authRoutes.js'
import postRoute from './routes/postsRoutes.js'
import commentRoute from './routes/commentsRoutes.js'

// env config
dotenv.config()

// app
const app = express()

// Middleware
app.use(cors())
app.use(express.static('uploads'))
app.use(express.json())
app.use(helmet())
app.disable('x-powered-by')
app.use(compression())

// Routes
app.use('/auth', authRoute)
app.use('/posts', postRoute)
app.use('/comments', commentRoute)

// Connect DB
async function dbConnect() {
  try {
    mongoose.set('strictQuery', false)

    await mongoose.connect(`${process.env.DB_URL}`).then(() => {
      console.log(`The connection to the database is established.`)
    })
  } catch (error) {
    console.log(error)
  }
}

// Start
async function start() {
  try {
    await dbConnect()

    app.listen(process.env.PORT, () => console.log(`Server started on port: ${process.env.PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()