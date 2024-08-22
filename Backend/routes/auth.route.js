import express from "express";
import {
  changePassword,
  checkAuth,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", resetPassword);
router.post("/change-password/:token", changePassword);

export default router;
