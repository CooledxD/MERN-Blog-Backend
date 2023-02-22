import jwt from 'jsonwebtoken'
import Joi from 'joi'

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ').pop()

    // Validation token
    Joi.assert(
      token, 
      Joi.string().required()
    )

    // Decoded token
    const tokenData = jwt.verify(
      token, 
      process.env.JWT_ACCESS_SECRET
    )

    // Putting the data from the token in the request
    req.userId = tokenData.id

    next()
  } catch (error) {
    res.status(400).json({
      message: 'Access token not valid'
    })
  }
}