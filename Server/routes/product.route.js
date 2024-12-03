import express from "express";
import isAuthentication, {  adminRoute } from "../middleware/authMiddleware.js";
import { getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";


const router = express.Router();

router.route('/').get(isAuthentication, adminRoute, getAllProducts );
router.route('/featured').get(getFeaturedProducts);


export default router;