import Joi from "joi";

import Post from "../../models/postModel.js";

export const validationGetPost = async (req, res, next) => {
  try {
    // validation postId
    Joi.assert(
      req.params.postId, 
      Joi.string()
        .pattern(/^[a-z0-9]+$/)
        .required()
        .messages({
          'string.pattern.base': 'incorrect post id'
        })
    )

    const post = Post.findById(req.params.postId)

    if (!post) {
      throw new Error('There is no such post')
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}