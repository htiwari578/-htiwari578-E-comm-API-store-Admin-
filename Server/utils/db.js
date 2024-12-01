import mongoose from "mongoose"

const connectDB = async ()=> {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connected");
    } catch (error) {
        console.log("DB not connected");
    }
}
export default connectDB;