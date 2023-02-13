import { Router } from "express";

import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import { updateAvatar, getUser } from '../controllers/userControllers.js'
import { upload } from "../middleware/multer.js";

const router = new Router()

// Update avatar
// /user/avatar
router.put('/avatar', upload, verifyAccessToken, updateAvatar)

// Get user info
// /user/get
router.get('/get', verifyAccessToken, getUser)

export default router