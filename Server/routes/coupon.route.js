import express from 'express'
import isAuthentication from '../middleware/authMiddleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';


const router = express.Router();

router.route("/").get(isAuthentication , getCoupon);
router.route("/validate").get(isAuthentication, validateCoupon);

export default router;