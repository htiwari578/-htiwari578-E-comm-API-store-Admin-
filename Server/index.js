import express from 'express'
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'
import ProductRoute from './routes/product.route.js'
import cartRoute from './routes/cart.routes.js'


dotenv.config();


const app = express();


const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());


app.use("/api/h3/user", userRoute);
app.use("/api/h3/products", ProductRoute);
app.use("/api/h3/cart", cartRoute);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is runing at port ${PORT}`);
})