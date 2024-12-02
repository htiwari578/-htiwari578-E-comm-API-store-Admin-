import express from "express";
import { signup } from "../controllers/user.controllers.js";

const router = express.Router();


router.route("/signup").post(signup);

export default router;