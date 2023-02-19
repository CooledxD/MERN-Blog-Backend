import { Router } from "express";

// Middleware
import { validationRegistration } from '../middleware/validation/validationRegistration.js'
import { validationActivationAccount } from '../middleware/validation/validationActivationAccount.js'
import { verifyActivationToken } from "../middleware/verifyTokens/verifyActivationToken.js";

// Controllers
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
router.post('/register', validationRegistration, register)

// Login
// /auth/login
router.post('/login', login)

// Activate account
// /auth/activate-account
router.post('/activate-account', verifyActivationToken, validationActivationAccount, activateAccount)

// Renew access token
// /auth/renew-access-token
router.post('/renew-access-token', renewAccessToken)

// Logout
// /auth/logout
router.get('/logout', logout)

export default router