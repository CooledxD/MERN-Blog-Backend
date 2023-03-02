import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";

import { validationCreatePost } from "../middleware/validation/validationCreatePost.js";
import { validationRemovePost } from "../middleware/validation/validationRemovePost.js";
import { validationUpdatePost } from "../middleware/validation/validationUpdatePost.js";
import { validationGetPost } from '../middleware/validation/validationGetPost.js'
import { validationGetAllPosts } from "../middleware/validation/validationGetAllPosts.js";
import { validationPostComments } from "../middleware/validation/validationPostComents.js";
import { validationAddRemoveLikes } from "../middleware/validation/validationAddRemoveLikes.js";

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

// Get All Posts
// /posts/
router.get('/', 
  validationGetAllPosts,
  getAllPosts
)

// Get User Posts
// /posts/user
router.get('/user-posts', 
  verifyAccessToken, 
  getUserPosts
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

// Get Post By Id
// /posts/:postId
router.get('/:postId',
  validationGetPost,
  getPostById
)

// Get post comments
// /posts/:postId/comments
router.get('/:postId/comments', 
  validationPostComments,
  getPostComments
)

// Adding a user's like to a post
// /posts/:postId/likes
router.put('/:postId/likes', 
  verifyAccessToken, 
  validationAddRemoveLikes,
  addUserLikePost
)

// Remove a user's like to a post
// /posts/:postId/likes
router.delete('/:postId/likes', 
  verifyAccessToken, 
  validationAddRemoveLikes,
  removeUserLikePost
)

export default router