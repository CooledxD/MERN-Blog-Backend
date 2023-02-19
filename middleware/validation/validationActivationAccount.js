import User from '../../models/userModel.js'

export const validationActivationAccount = async (req, res, next) => {
  try {
    const { email } = req.body

    // we do not allow the token to be reused if the user is already registered
    const isUsedEmail = await User.findOne({
      email: email
    })

    if (isUsedEmail) {
      throw new Error('This email already exists')
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}