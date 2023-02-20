import Post from "../../models/postModel.js";

export const validationGetAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()

    if (!posts) {
      throw new Error('There are no posts')
    }

    next()
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}