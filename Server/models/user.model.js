import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true
    },

    cartItem:[
        {
            quantity:{
                type:Number,
                default:1,
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product"
            }
        }
    ],
    role:{
        type:String,
        enum:['User','admin'],
        default:'User'
    },

},{timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;