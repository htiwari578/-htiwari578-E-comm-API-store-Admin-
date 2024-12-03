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
// create a new product

export const createProduct = async (req, res)=>{

    try {
        const {name , description, price, image,   category,  isFeatured}= req.body;
        if(!name || !description ||  !price || !image ||  !category){
            return res.status(400).json({
                message:"Please provide all required fields ",
                success:false
            });
        }

        // Upload the image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
            folder: "products",
        });

        const product = new Product({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url,
            category,
            isFeatured: isFeatured || false,

        });
        // save the product in database
        const savedProduct = await product.save();

        res.status(201).json({
            message:"Product created successfuly",
            success:true,
            product: savedProduct,
        });

    } catch (error) {
        console.log(error);
    }
   

}

// delete from the database 
// Remove image from cloudinary using public ID
export const deleteProduct = async (req, res) =>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message:"Product not found",
                success:false
            });
        }
        // delete image from cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(product?.image?.public_id);
        if(cloudinaryResponse.result !== 'ok'){
            return res.status(500).json({
                message:"Error while deleting product image",
                success:false
            });
        }

        // delete product from database
        await product.remove();
        res.status(200).json({
            message:"Product deleted successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getRecommendedProducts = async (req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:3}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}


export const getProductByCategory = async (req,res)=>{
    try {
        const {category} = req.params;
        const products = await Product.find({category});

        res.status(200).json({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
    }

}