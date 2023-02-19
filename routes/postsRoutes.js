import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";
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
router.post('/', upload, verifyAccessToken, createPost)

// Get All Posts
// /posts/
router.get('/', getAllPosts)

// Get User Posts
// /posts/user
router.get('/user', verifyAccessToken, getUserPosts)

// Get Post By Id
// /posts/:id
router.get('/:id', getPostById)

// Update Post
// /posts/:id
router.put('/:id', upload, verifyAccessToken, updatePost)

// Remove post
// /posts/:id
router.delete('/:id', verifyAccessToken, removePost)

// Get post comments
// /posts/comments/:id
router.get('/comments/:id', getPostComments)

// Adding a user's like to a post
// /posts/likes/:id
router.put('/likes/:id', verifyAccessToken, addUserLikePost)

// Remove a user's like to a post
// /posts/likes/:id
router.delete('/likes/:id', verifyAccessToken, removeUserLikePost)

export default router