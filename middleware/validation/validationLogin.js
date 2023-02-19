import bcrypt from 'bcrypt'
import Joi from 'joi'

import User from '../../models/userModel.js'

const loginSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]/)
    .min(3)
    .max(10)
    .required()
    .messages({
      '*': 'incorrect syntax'
    }),

  password: Joi.string()
    .alphanum()
    .min(8)
    .max(30)
    .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
    .required()
    .messages({
      '*': 'incorrect syntax'
    }),
})

export const velidationLogin = async (req, res, next) => {
  try {
    // validation of the request body
    await loginSchema.validateAsync(req.body)

    // find the user with the required username in the database
    const isUsedLogin = await User.findOne({ 
      username: req.body.username 
    })

    if (!isUsedLogin) {
      throw new Error('Invalid username')
    }

    // comparing password hash
    const isValidPass = await bcrypt.compare(
      req.body.password, 
      isUsedLogin.password
    )

    if (!isValidPass) {
      throw new Error('Invalid password')
    }

    // put the found document in the body of the request
    req.body = {
      user: isUsedLogin
    }
    
    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}