import Product from "../models/product.model.js"
import { redis } from "../utils/redis.js";


export const getAllProducts = async (req,res)=>{

};

export const getFeaturedProducts = async (req,res)=>{
    try {
    let featuredProducts = await redis.get("featured_products")
    if(featuredProducts){
        return res.json(JSON.parse(featuredProducts));
    }

    // if it not in redis, fetch it from mongodb
    featuredProducts = await Product.find({isFeatured:true}).lean();
    if(!featuredProducts){
        return res.status(404).json({
            message:"No featured products found",
            success:false
        })
    }
    // but if we had it store in cache for quick access
    await redis.set("featured_products" , JSON.stringify(featuredProducts));

    res.json(featuredProducts);

    } catch (error) {
        console.log(error);
    }
}