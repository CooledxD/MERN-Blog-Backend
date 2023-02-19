import Joi from 'joi'
import jwt from 'jsonwebtoken'

// Joi schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
})

export const verifyRefreshToken = async (req, res, next) => {
  try {
    // validation of the request body
    await refreshTokenSchema.validateAsync(req.cookies, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    // token validation
    const tokenData = jwt.verify(
      req.cookies.refreshToken, 
      process.env.JWT_REFRESH_SECRET
    )

    // passing data from the token to the request body
    req.body = {
      tokenData
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: 'Refresh token not valid'
    })
  }
}