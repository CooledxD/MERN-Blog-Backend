import Joi from "joi";

const updatePostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),

  text: Joi.string()
    .trim()
    .required()
})

export const validationUpdatePost = async (req, res, next) => {
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

    const formData = await updatePostSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    req.body = formData

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}