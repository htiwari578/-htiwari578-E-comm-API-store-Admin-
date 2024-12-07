import express from "express";
import { getProfile, login, logout, refreshAccessToken, signup } from "../controllers/user.controllers.js";
import isAuthentication from "../middleware/authMiddleware.js";

const router = express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/logout').post(logout);
router.route('/profile').get(isAuthentication , getProfile);

export default router;