import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";

import { validationCreateComment } from "../middleware/validation/validationCreateComment.js";
import { validationRemoveComment } from "../middleware/validation/validationRemoveComment.js";

// Controllers
import { createComment, removeComment } from '../controllers/commentsControllers.js'

const router = new Router()

// Create comment
// /comments/
router.post('/', 
  verifyAccessToken, 
  validationCreateComment, 
  createComment
)

// Remove comment
// /comments/
router.delete('/', 
  verifyAccessToken, 
  validationRemoveComment, 
  removeComment
)

// // Update comment
// router.put('/:id', checkAuth, createComment)

export default router