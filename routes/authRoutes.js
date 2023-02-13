import { Router } from "express";

import { register, login, getMe } from '../controllers/authControllers.js'
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = new Router()

// Register
// /auth/register
router.post('/register', register)

// Login
// /auth/login
router.post('/login', login)

// Get me
// /auth/me
router.get('/me', verifyAccessToken, getMe)

export default router