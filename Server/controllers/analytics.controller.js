import Order from "../models/order.model.js";
import Product from "../models/product.model.js";


export const getAnalyticsData = async ()=>{
    const totalUsers = await User.countDocumenst();
    const totalProducts = await Product.countDocuments();


    const salesData = await Order.aggregate([
        {
            $group: {
                _id:null,
                totalSales: {$sum},
                totalRevenue:{$sum : "$totalAmount"}
        }
    }
    ])

    const {totalSales , totalRevenue} = salesData[0] || {totalSales:0, totalRevenue:0};

    return {
        users:totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue

}
}