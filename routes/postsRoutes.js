import { Router } from "express";

import { checkAuth } from '../middleware/checkAuth.js'
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
import { upload } from "../middleware/multer.js";

const router = new Router()

// Create Post
// /posts/
router.post('/', upload, checkAuth, createPost)

// Get All Posts
// /posts/
router.get('/', getAllPosts)

// Get User Posts
// /posts/user
router.get('/user', checkAuth, getUserPosts)

// Get Post By Id
// /posts/:id
router.get('/:id', getPostById)

// Update Post
// /posts/:id
router.put('/:id', upload, checkAuth, updatePost)

// Remove post
// /posts/:id
router.delete('/:id', checkAuth, removePost)

// Get post comments
// /posts/comments/:id
router.get('/comments/:id', getPostComments)

// Adding a user's like to a post
// /posts/likes/:id
router.put('/likes/:id', checkAuth, addUserLikePost)

// Remove a user's like to a post
// /posts/likes/:id
router.delete('/likes/:id', checkAuth, removeUserLikePost)

export default router