import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";

// Controllers
import { createComment, removeComment } from '../controllers/commentsControllers.js'

const router = new Router()

// Create comment
// /comments/:id
router.post('/:id', verifyAccessToken, createComment)

// Remove comment
// /comments/:id
router.delete('/:id', verifyAccessToken, removeComment)

// // Update comment
// router.put('/:id', checkAuth, createComment)

export default router