import { Router } from "express";

import { checkAuth } from "../utils/checkAuth.js";
import { createComment, removeComment } from '../controllers/Comment.controllers.js'

const router = new Router()

// Create comment
router.post('/:id', checkAuth, createComment)

// Remove comment
// /comments/:id
router.delete('/:id', checkAuth, removeComment)

// // Update comment
// router.put('/:id', checkAuth, createComment)

export default router