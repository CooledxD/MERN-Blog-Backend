import { Router } from "express";

import { checkAuth } from "../middleware/checkAuth.js";
import { updateAvatar } from '../controllers/userControllers.js'
import { upload } from "../middleware/multer.js";

const router = new Router()

// Update avatar
// /user/avatar
router.put('/avatar', upload, checkAuth, updateAvatar)

export default router