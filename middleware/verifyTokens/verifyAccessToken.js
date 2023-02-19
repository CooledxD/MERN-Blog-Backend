import jwt from 'jsonwebtoken'
import Joi from 'joi'

export const verifyAccessToken = async (req, res, next) => {
  try {
    // Validation token
    Joi.assert(
      req.headers.authorization, 
      Joi.string().required()
    )

    // Decoded token
    const tokenData = jwt.verify(
      req.headers.authorization, 
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