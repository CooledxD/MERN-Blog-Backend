import Joi from "joi";
import { unlink } from 'node:fs/promises'
import { fileURLToPath } from 'url';

// Back __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const createPostSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),

  text: Joi.string()
    .trim()
    .required()
})

export const validationCreatePost = async (req, res, next) => {
  try {
    // validation of the request body
    const formData = await createPostSchema.validateAsync(req.body, {
      errors: {
        wrap: {
          label: false
        }
      }
    })

    req.body = formData

    next()
  } catch (error) {
    // check the image was transferred
    const image = req.file ? req.file.filename : ''

    // deleting the image
    if (image) {
      /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as no value holds user input */
      unlink(`${__dirname}/../../uploads/${image}`)
    }

    res.status(400).json({
      message: error.message
    })
  }
}