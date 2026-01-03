import cookie from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
export const verficationJWT=asyncHandler(async(req ,res, next)=>{
const token =req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
if(!token){
    throw new ApiError(409,"access token not found",[]);
}
try{
const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
const user= await User.findById(decodedToken._id).select(
   "-password -refreshTokens"
);
if(!user){
   throw new ApiError(409,"user not found",[]); 
}
req.user=user;
next();
}
catch(error){
        throw new ApiError("500", "invalid access token ");
}

});