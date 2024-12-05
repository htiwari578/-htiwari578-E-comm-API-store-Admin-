import Product from "../models/product.model.js";



export const getCartProducts = async (req,res)=>{
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}});

        // add quantity for each product
        const cartItems = products.map(product => {
            const iten = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(),quantity:item.quantity }   
        })
        res.json(cartItems)
        } catch (error) {
        console.log("error in getting cart products", error);
        return res.statu(500).json({
            message:"Server error",
            success:false
        })

    }
}

export const addToCart = async (req,res)=>{
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId);
        };
        await user.save();
        return res.status(200).json({
            message:"product added to cart",
            cartItems:user.cartItems,
            success:true
        })

    } catch (error) {
        console.log("error in add to cart",error);
        res.status(500).json({
            message:"server error",
            success:false,
            error:error.message
        });
    }
};

export const removeAllProductCart = async (req, res)=>{
    try {
        const {productId} = req.body;
        const user = req.user;

        if(!productId){
            user.cartItems = [];

        }else{
            user.cartItems = user.cartItems.filter((item)=> item.id !== productId);
        }
        await user.save();
        return res.status(200).json({
            message:"removed all products from cart",
            cartItems: user.cartItems,
            success: true

        })

    } catch (error) {
        console.log("error in add to cart",error);
        res.status(500).json({
            message:"server error",
            success:false,
            error:error.message
        });
    }
}


export const updateQuantity = async (req,res)=>{
    try {
        const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}

    } catch (error) {
        console.log("error",error);
        res.status(500).json({
            message:"server error",
            success:false,
            error:error.message
        });
    }
}