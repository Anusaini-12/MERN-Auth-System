import express from 'express';
import { deleteAllUsers, forgotPassword, getMe, loginUser, registerUser, resetPassword, verifyEmail } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/me",protect, getMe);
router.delete("/deleteAll", deleteAllUsers);


export default router;

