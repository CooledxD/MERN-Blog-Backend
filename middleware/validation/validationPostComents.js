import Joi from "joi";

import Post from "../../models/postModel.js";

export const validationPostComments = async (req, res, next) => {
  try {
    // validation postId
    Joi.assert(
      req.params.postId, 
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'incorrect post id'
        })
    )

    // check if the post exists
    const post = await Post.findById(req.params.postId)

    if(!post) {
      throw new Error('There is no such post')
    }

    req.body = {
      post
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}