import Joi from 'joi'
import jwt from 'jsonwebtoken'

// Joi schema
const activationTokenSchema = Joi.object({
  activationToken: Joi.string()
    .required()
})

export const verifyActivationToken = async (req, res, next) => {
  try {
    // validation of the request body
    await activationTokenSchema.validateAsync(req.body)

    // token validation
    const newUserData = jwt.verify(
      req.body.activationToken, 
      process.env.JWT_ACTIVATION_SECRET
    )

    // passing data from the token to the request body
    req.body = newUserData

    next()
  } catch (error) {
    res.status(400).json({
      message: 'Activation token not valid'
    })
  }
}