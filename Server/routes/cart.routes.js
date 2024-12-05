import express from "express";
import isAuthentication from "../middleware/authMiddleware.js";
import { addToCart, getCartProducts, removeAllProductCart, updateQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.route("/").get(isAuthentication , getCartProducts);
router.route("/").post(isAuthentication, addToCart);
router.route("/").delete(isAuthentication , removeAllProductCart);
router.route("/:id").put(isAuthentication, updateQuantity);


export default router;