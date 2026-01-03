import { v2 as cloudinary } from 'cloudinary'
import dotenv from "dotenv"
import { response } from 'express';
import fs from "fs";
dotenv.config();
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});
export const uploadOnCloudinary=async(localFilePath)=>{
try{
if(!localFilePath)return null;
const response= await cloudinary.uploader
  .upload(localFilePath,{
      resource_type: "auto"
  })
 
 if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }  return response;

}
 catch (error) {
    console.log("Error uploading file to Cloudinary:", error);
 if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }    return null;
  }
}
export const deleteFromCloudinary=async(filePath)=>{
try{
    await cloudinary.uploader.destroy(filePath);
        return console.log("File deleted successfully!");
}
catch(error){
    console.log("something went wrong while deleting file from cloudinary");

}
}