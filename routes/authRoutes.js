import { Router } from "express";

// Middleware
import { validationRegistration } from '../middleware/validation/validationRegistration.js'
import { validationActivationAccount } from '../middleware/validation/validationActivationAccount.js'
import { verifyActivationToken } from "../middleware/verifyTokens/verifyActivationToken.js";
import { velidationLogin } from '../middleware/validation/validationLogin.js'

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

// Activate account
// /auth/activate-account
router.post('/activate-account', verifyActivationToken, validationActivationAccount, activateAccount)

// Login
// /auth/login
router.post('/login', velidationLogin, login)

// Renew access token
// /auth/renew-access-token
router.post('/renew-access-token', renewAccessToken)

// Logout
// /auth/logout
router.get('/logout', logout)

export default router