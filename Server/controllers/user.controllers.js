import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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