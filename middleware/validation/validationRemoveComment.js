import Joi from "joi";

import Comment from '../../models/commentModel.js'

const removeCommentSchema = Joi.object({
  postId: Joi.string()
    .required(),

  commentId: Joi.string()
    .required()
})

export const validationRemoveComment = async (req, res, next) => {
  try {
    await removeCommentSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

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