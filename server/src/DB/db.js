 import mongoose from 'mongoose';
 import dotenv from 'dotenv';
 dotenv.config();

const  connectDb=async()=>{
    try{
  await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected successfully");
 //console.log(process.env.MONGO_URI);

    }
    catch(err){
        console.log(`mongodb connection failed`);
        process.exit(1);
    }
}
export default connectDb;
