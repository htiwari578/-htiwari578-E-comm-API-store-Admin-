import express from "express";
import isAuthentication, {  adminRoute } from "../middleware/authMiddleware.js";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, getRecommendedProducts, toggleFeaturesProduct } from "../controllers/product.controller.js";


const router = express.Router();

router.route('/').get(isAuthentication, adminRoute, getAllProducts );
router.route('/featured').get(getFeaturedProducts);
router.route('/reccomendation').get(getRecommendedProducts);
router.route('/category/:category').get(getProductByCategory);
router.route('/create').post(isAuthentication, adminRoute, createProduct);
router.route('/id').patch(isAuthentication,adminRoute, toggleFeaturesProduct);
router.route('/id:/delete').delete(isAuthentication, adminRoute, deleteProduct);



export default router;