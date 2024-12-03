import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthentication = async (req, res,next)=> {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({
                message:"User not authencticated",
                success:false
            });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
         // Find the user to ensure they exist and get full user details
         const user = await User.findById(decoded.userId).select("-password");
       // If the token is invalid, return a 401 status (Unauthorized)
       if (!user) {
        return res.status(401).json({
            message: "User not found",
            success: false
        });
    }

    // Attach the user ID or user info to the request object
    req.user = decoded;  // Assuming the decoded token contains user information
    next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthentication;


export const adminRoute = (req,res,next)=>{
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only",
                success: false
            });
        }
        next();
    } catch (error) {
        console.log(error);
    }
}