import express from "express";
import { login, logout, refreshAccessToken, signup } from "../controllers/user.controllers.js";

const router = express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/logout').post(logout);

export default router;