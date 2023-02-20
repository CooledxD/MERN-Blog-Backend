import Post from "../../models/postModel.js";

export const validationRemovePost = async (req, res, next) => {
  try {
    // looking for a post in the database
    const post = await Post.findById(req.params.postId)

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