import { Router } from "express";
import { register, login, getMe } from '../controllers/Auth.controllers.js'
import { checkAuth } from "../utils/checkAuth.utils.js";

const router = new Router()

// Register
router.post('/register', register)

// Login
router.post('/login', login)

// Get me
router.get('/me', checkAuth, getMe)

export default router