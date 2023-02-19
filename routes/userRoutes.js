import { Router } from "express";

// Middleware
import { verifyAccessToken } from "../middleware/verifyTokens/verifyAccessToken.js";
import { upload } from "../middleware/multer.js";

// Controllers
import { updateAvatar, getUser } from '../controllers/userControllers.js'

const router = new Router()

// Update avatar
// /user/avatar
router.put('/avatar', 
  upload, 
  verifyAccessToken, 
  updateAvatar
)

// Get user info
// /user/get
router.get('/get', 
  verifyAccessToken, 
  getUser
)

export default router