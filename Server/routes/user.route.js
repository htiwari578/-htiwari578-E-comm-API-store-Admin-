import express from "express";
import { login, refreshAccessToken, signup } from "../controllers/user.controllers.js";

const router = express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route('/refresh-token').post(refreshAccessToken);

export default router;