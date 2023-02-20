import Joi from "joi";

import Comment from '../../models/commentModel.js'

const removeCommentSchema = Joi.object({
  postId: Joi.string()
    .pattern(/^[a-z0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'incorrect syntax'
    }),

  commentId: Joi.string()
    .pattern(/^[a-z0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'incorrect syntax'
    })
})

export const validationRemoveComment = async (req, res, next) => {
  try {
    // validation of the request body
    await removeCommentSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    // looking for a comment in the database
    const comment = await Comment.findById(req.body.commentId)

    if(!comment) {
      throw new Error('There is no such post')
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}