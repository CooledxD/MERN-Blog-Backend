import { Router } from "express";

import { checkAuth } from '../utils/checkAuth.utils.js'
import { createPost, getAllPosts, getPostById, getUserPosts, removePost, updatePost } from "../controllers/Posts.controllers.js";

const router = new Router()

// Create Post
router.post('/', checkAuth, createPost)

// Get All Posts
router.get('/', getAllPosts)

// Get User Posts
router.get('/user', checkAuth, getUserPosts)

// Get Post By Id
router.get('/:id', getPostById)

// Update Post
router.put('/:id', checkAuth, updatePost)

// Remove post
router.delete('/:id', checkAuth, removePost)

export default router