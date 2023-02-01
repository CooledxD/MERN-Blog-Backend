import { Router } from "express";

import { checkAuth } from "../utils/checkAuth.js";
import { createComment, removeComment } from '../controllers/commentsControllers.js'

const router = new Router()

// Create comment
// /comments/:id
router.post('/:id', checkAuth, createComment)

// Remove comment
// /comments/:id
router.delete('/:id', checkAuth, removeComment)

// // Update comment
// router.put('/:id', checkAuth, createComment)

export default router