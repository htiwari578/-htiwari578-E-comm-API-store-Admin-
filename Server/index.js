import express from 'express'
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'
import ProductRoute from './routes/product.route.js'
import cartRoute from './routes/cart.routes.js'
import couponRoutes from './routes/cart.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import analyticRoutes from './routes/analytics.route.js'

dotenv.config();


const app = express();


const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());


app.use("/api/h3/user", userRoute);
app.use("/api/h3/products", ProductRoute);
app.use("/api/h3/cart", cartRoute);
app.use("/api/h3/coupons", couponRoutes);
app.use("/api/h3/payments", paymentRoutes);
app.use("/api/h3/analytics", analyticRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is runing at port ${PORT}`);
})