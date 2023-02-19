import Joi from 'joi'

import User from '../../models/userModel.js'

// Joi schema
const registrationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]/)
    .min(3)
    .max(10)
    .required()
    .messages({
      'string.pattern.base': 'username must not start with digits'
    }),

  password: Joi.string()
    .alphanum()
    .min(8)
    .max(30)
    .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/)
    .required()
    .messages({
      'string.pattern.base': 'password must contain uppercase and lowercase letters, as well as numbers'
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'passwords don\'t match'
    }),

  email: Joi.string()
    .email()
    .required()
})

export const validationRegistration = async (req, res, next) => {
  try {
    // validation of the request body
    await registrationSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    // checking the username reservation
    const isUsedLogin = await User.findOne({ username: req.body.username })

    if (isUsedLogin) {
      throw new Error('This login is already in use')
    }

    // checking the email reservation
    const isUsedEmail = await User.findOne({ email: req.body.email })

    if (isUsedEmail) {
      throw new Error('This email is already in use')
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}