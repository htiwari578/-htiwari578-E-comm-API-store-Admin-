import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {redis} from '../utils/redis.js'


export const signup = async (req,res) => {
    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                mesage:"Something is missing",
                success:false
            })
        };
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message:"Email already registered",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10);

        await User.create ({
            name,
            email,
            password:hashedPassword,
        });
        return res.status(201).json({
            message:"Account created succesfully",
            required:true
        })
    } catch (error) {
        console.log(error);
    }
} 

export const login = async (req,res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
   
        let user = await User.findOne({email});
        if(!user){
            return res.statu(400).json({
                message:"Incorrect emai or password",
                success:false
            });
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Wrong password",
                success:false
            })
        };

        // generate access token and refresh token (redis)
        const tokenData = {userID: user._id};
        const accessToken= jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15m'});
        const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});

        // save refresh token in redis
        await redis.set(user._id.toString(), refreshToken, 'EX',7 * 24 * 60 * 60);  

        // set rrefresh token in cookies and return access token
        return res.status(200).cookie("refreshToken", refreshToken, 
            {
            maxAge:7 * 24 * 60 * 60 * 1000, 
            httpOnly:true, sameSite:'strict'
        }).json({
            message:`welcome back ${user.name}`,
            success:true,
            accessToken
        })
    } catch (error) {
        console.log(error);
    }

};
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token missing", success: false });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the refresh token exists in Redis
        const storedToken = await redis.get(decoded.userID.toString());
        if (!storedToken || storedToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token", success: false });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ userID: decoded.userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        return res.status(200).json({
            accessToken: newAccessToken,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Invalid or expired refresh token", success: false });
    }
};
export const logout = async (req,res) => {
    try {
        // get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(400).json({
                message:"No token provided , already locked out",
                success:false
            })
        }
        // verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Delete the refresh token from redis
        await redis.del(decoded.userID);

        // Clear the refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly:true,
            sameSite:'strict'
        });

        // success response
        return res.status(200).json({
        message:'Logged out Successfully',
        success:true
    })
    } catch (error) {
        console.log(error);
    }
}