import Coupon from "../models/coupon.modell.js";


export const getCoupon = async(req , res)=>{
    try {
        // find activer coupon from the current user

        const coupon = await Coupon.findOne({userId: req.user._id, isActive: true});

        // if no coupon found return null
        res.json(coupon || null);
    } catch (error) {
        console.log("error in fetching coupon" , error);
        res.status(500).json({
            message:"Something went wrong",
            error:error.message
        });
    }
}

export const validateCoupon = async (req, res)=>{
    try {
        const {code} = req.body;

        // find  coupon code by the code , user id , and if its active
        const coupon = await Coupon.findOne({code : code, userId: req.user._id, isActive:true});
        //  if coupon not found
        if(!coupon){
            return res.status(404).json({
                message:"Coupon not found"
            });
        }

        // check if coupon has expired

        if(coupon.expirationDate < new Date()){
            // if coupon expired , dectivate it 
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({
                message:"coupon expired"
            });
        }
        // if coupon valid;
        res.json({
            message:"Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        })
    } catch (error) {
        console.log("error in validating coupon", error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
}