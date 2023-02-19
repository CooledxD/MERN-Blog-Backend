import jwt from 'jsonwebtoken'

// Create activation token
export const createActivationToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACTIVATION_SECRET,
    {
      expiresIn: '5m'
    }
  )
}

// Create access token
export const createAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

// Create refresh token
export const createRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d'
    }
  )
}