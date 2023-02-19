import Joi from "joi";

const createCommentSchema = Joi.object({
  postId: Joi.string()
    .required(),

  authorAvatar: Joi.string()
    .empty(''),

  comment: Joi.string()
    .trim()
    .required()
})

export const validationCreateComment = async (req, res, next) => {
  try {
    const value = await createCommentSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    req.body = value

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}