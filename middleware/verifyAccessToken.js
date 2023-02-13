import jwt from 'jsonwebtoken'

export const verifyAccessToken = (req, res, next) => {
  try {
    // Request
    const token = req.headers.authorization

    // Validation
    if (!token) {
      return res.status(400).json({
        message: 'Token not found'
      })
    }

    // Decoded token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

    // Putting the data from the token in the request
    req.userId = decoded.id

    next()
  } catch (error) {
    console.log(error)

    return res.status(403).json({
      message: 'Нет доступа.'
    })
  }
}