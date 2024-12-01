import express from 'express'
import dotenv from "dotenv";
import connectDB from './utils/db.js';


dotenv.config();


const app = express();


const PORT = process.env.PORT || 4000;


// app.use("api/h3/user", userRoute);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is runing at port ${PORT}`);
})