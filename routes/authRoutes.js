import { Router } from "express";

import { 
  register, 
  login, 
  activateAccount,  
  renewAccessToken, 
  logout 
} from '../controllers/authControllers.js'

const router = new Router()

// Register
// /auth/register
router.post('/register', register)

// Login
// /auth/login
router.post('/login', login)

// Activate account
// /auth/activate-account
router.post('/activate-account', activateAccount)

// Renew access token
// /auth/renew-access-token
router.post('/renew-access-token', renewAccessToken)

// Logout
// /auth/logout
router.get('/logout', logout)

export default router