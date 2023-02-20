import Joi from "joi";

import Comment from "../../models/commentModel.js";
import Post from "../../models/postModel.js";

export const validationPostComments = async (req, res, next) => {
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

    // check if the post exists
    const post = await Post.findById(req.params.postId)

    if(!post) {
      throw new Error('There is no such post')
    }

    // check if there are any comments
    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment)
      })
    )

    if (!list.length) {
      throw new Error('There are no comments')
    }

    req.body = {
      list
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}