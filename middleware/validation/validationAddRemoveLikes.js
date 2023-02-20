import Joi from "joi";

const addLikeSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .pattern(/^[a-zA-Z]/)
    .min(3)
    .max(10)
    .required()
    .messages({
      'string.pattern.base': 'username must not start with digits'
    }),
})

export const validationAddRemoveLikes = async (req, res, next) => {
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

    await addLikeSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}