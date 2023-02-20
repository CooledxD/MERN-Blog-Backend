import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";

import { validationCreatePost } from "../middleware/validation/validationCreatePost.js";
import { validationRemovePost } from "../middleware/validation/validationRemovePost.js";
import { validationUpdatePost } from "../middleware/validation/validationUpdatePost.js";

import { upload } from "../middleware/multer.js";

// Controllers
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  getUserPosts, 
  removePost, 
  updatePost, 
  getPostComments, 
  addUserLikePost,
  removeUserLikePost
} from "../controllers/postControllers.js";

const router = new Router()

// Create Post
// /posts/
router.post('/', 
  verifyAccessToken,
  upload,
  validationCreatePost,
  createPost
)

// Remove post
// /posts/:postId
router.delete('/:postId', 
  verifyAccessToken,
  validationRemovePost,
  removePost
)

// Update Post
// /posts/:postId
router.put('/:postId', 
  verifyAccessToken,
  upload,
  validationUpdatePost,
  updatePost
)

// Get All Posts
// /posts/
router.get('/', 
  getAllPosts
)

// Get User Posts
// /posts/user
router.get('/user', 
  verifyAccessToken, 
  getUserPosts
)

// Get Post By Id
// /posts/:id
router.get('/:id', 
  getPostById
)

// Get post comments
// /posts/comments/:id
router.get('/comments/:id', 
  getPostComments
)

// Adding a user's like to a post
// /posts/likes/:id
router.put('/likes/:id', 
  verifyAccessToken, 
  addUserLikePost
)

// Remove a user's like to a post
// /posts/likes/:id
router.delete('/likes/:id', 
  verifyAccessToken, 
  removeUserLikePost
)

export default router