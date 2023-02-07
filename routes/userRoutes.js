import { Router } from "express";

import { checkAuth } from "../middleware/checkAuth.js";
import { updateAvatar, getUser } from '../controllers/userControllers.js'
import { upload } from "../middleware/multer.js";

const router = new Router()

// Update avatar
// /user/avatar
router.put('/avatar', upload, checkAuth, updateAvatar)

// Get user info
// /user/get
router.get('/get', checkAuth, getUser)

export default router