import Joi from "joi";

const createCommentSchema = Joi.object({
  postId: Joi.string()
    .pattern(/^[a-z0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'incorrect syntax'
    }),

  authorAvatar: Joi.string()
    .empty(''),

  comment: Joi.string()
    .trim()
    .required()
})

export const validationCreateComment = async (req, res, next) => {
  try {
    // validation of the request body
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