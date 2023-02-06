import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization)?.split(' ').pop().trim()

  if(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRED)

      req.userId = decoded.id
      
      next()
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа.'
      })
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа.'
    })
  }
}