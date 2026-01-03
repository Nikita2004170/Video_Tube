import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import cookie from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

import { sendMail ,passwordResetMailgen} from "../utils/mail.js";
import mongoose from "mongoose";
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens", []);
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (errr) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
      []
    );
  }
};
export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  const existeduser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existeduser) {
    throw new ApiError(401, " user already exist", []);
  }
   console.log("hii");
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log(avatarLocalPath);
 if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await User.create({
//     avatar: {
//   url: avatar.secure_url,
// },
avatar: {
    url: avatar.secure_url || avatar.url,
    localpath: avatarLocalPath, // optional, or ""
  },
    username,
    email,
    password,
  });
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select(
    "-password "
  );
  if (!createdUser) {
    throw new ApiError(409, " user not created", []);
  }
  return res
    .status(201)
    .json(new ApiResponse(200, user.username, "user created successfully"));
});
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(409, " user not created", []);
  }
  console.log(user.username)
  console.log(user.password);
  const isPasswordValid =await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(409, "password is not correct", []);
  }
  const { accessToken, refreshToken } =await generateAccessTokenAndRefreshToken(
    user._id
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedinUser) {
    throw new ApiError(500, "Something went wrong while logging in a user");
  }
  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
.json(new ApiResponse(200, loggedinUser, "user logged in successfully"));});
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: "" } },
    { new: true }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  if (!user) {
    throw new ApiError(401, "user not found");
  }
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "userlogout successfully"));
});
 export const  forgotPassword=asyncHandler(async (req , res)=>{
const {email}=req.body;
  const user=await User.findOne({email})
   if(!user){
    throw new ApiError (400,"user not found");
  }
   const { unhashedToken, hashedToken, tokenExpiry }=user.generateTemperoryToken();
   user.forgotPasswordToken=hashedToken,//compare
   user.forgotPasswordTokenExpiry=tokenExpiry//compare
         await user.save({ validateBeforeSave: false });
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${unhashedToken}`;

         await sendMail({
            email:user?.email,
            subject:"your request for forgot email",
//             mailgenContent:passwordResetMailgen(
//         user.username,
// `${req.protocol}://${req.get("host")}/reset-password/${unhashedToken}`
//       )
    mailgenContent: passwordResetMailgen(user.username, resetURL),

         })
         return res.status(200).json(
         new ApiResponse(201,"email has sent to your email"))
 });
 export const resetPassword=asyncHandler(async(req , res)=>{
    const {resetToken}= req.params;
    const hashedToken=crypto
   .createHash("sha256")
   .update(resetToken)
  .digest("hex");

   const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  });
   if(!user){
    throw new ApiError (400,"user not found");
  }
  user.password=req.body.password;
   user.forgotPasswordToken=undefined;
  user.forgotPasswordTokenExpiry=undefined;
  await user.save({validateBeforeSave:false});
  return res.status(200).json(
    new ApiResponse(200,"password reset successfully")
  );
 });
 export const updatePassword=asyncHandler(async(req , res)=>{
    const{oldpassword, newpassword}=req.body;
    const user=await User.findById (req.user._id);
     if (!user) {
    throw new ApiError(409, " user not found", []);
  }
    const isPasswordValid=user.isPasswordCorrect(oldpassword);
     if (!isPasswordValid) {
    throw new ApiError(409, "password is not correct", []);
  }
  user.password=newpassword;
  await user.save({validateBeforeSave:false});
  return res.status(200).json(
    new ApiResponse(200,"password updated successfully")
  );

 });
 export const accessTokenGeneration = asyncHandler(async(req ,res)=>{
  const { refreshToken }= req.cookies;
  if(!refreshToken){
    throw new ApiError (401,"no refresh token in cookies");
  }
  const decodedToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
  const user= await User.findById(decodedToken._id);
  if(!user){
    throw new ApiError (401,"invalid refresh token");
  }
  if(user.refreshToken !==refreshToken){
    throw new ApiError (401,"refresh token mismatch");
  }
const options={
  httpOnly:true,
  secure:true,
}  
const {accessToken, refreshToken:newRefreshToken}=await generateAccessTokenAndRefreshToken(user._id) ;
refreshToken=newRefreshToken;

return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(200,
    {accessToken,refreshToken},
    "new access token generated successfully"
  )
);

 });
 export const updateUserDetail=asyncHandler(async (req ,res)=>{
  const{username}=req.body;
  const user=await User.findById(req.user._id);
  if(!user){
       throw new ApiError(409, " user not found", []); 
  }
user.username=username;
await user.save({validateBeforeSave:false});
return res.status(201).json(
  new ApiResponse(200,"username updated successfully")
);
 })
 export const getUserDetail=asyncHandler(async (req ,res)=>{
const {username}=req.params;
 if (!username) {
    throw new ApiError(400, "User does not exist");
  }
  const channel=await User.aggregate([
    {
      $match:{
        username:username?.toLowerCase(),
      }
    },
    {
      $lookup:{ //channel follows me 
          from: "subscriptions",
        localField: "_id",
        foreignField: "channel",//userIdOfChannelBeingSubscribed
        as: "subscribers", //subscriber: "userIdOfPersonWhoSubscribed",
      }
    },
    {
      $lookup: { //channel i subscribed
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribers",
        as: "subscribedTo",
      },

    },
    {
      $addFields:{
        subscriberCount:{
          $size:"$subscribers"
        },
        subscriberChannel:{
          $size:"$subscribedTo"
        },
          // isSubscribed:{
          //   $cond:{
          //     if:{$in:[req.user?._id,"$subscriber:subscriber"]},
          //     then:true,
          //   else:false
          //   }
          // }
      }
    },
    {
      $project:{
        username:1,
        avatar:1,
        subscriberChannel:1,
        subscriberCount:1,
      }
    }
  ])
  if(!channel){
    throw new ApiError(402,"something went wrong while creating channel")
  }
return res.status(200).json(
  new ApiResponse(200,channel[0],"channel found successfully")
)
 })
 export const getUserWatchHistory=asyncHandler(async (req ,res)=>{
  const userAgg=await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id" ,
        as:"watchHistory",
         //What $lookup does: for the current user document, it looks into the videos collection 
         // and finds all documents where videos._id equals any value in the user's localField array. 
        // Then it attaches the matched video documents as an array on the current document at the as path.
        pipeline:[
          {
            $lookup:{
                 from:"users",
        localField:"owner",
        foreignField:"_id" ,
        as:"owner",
        pipeline:[
         {
          $project:{
            username:1,
            avatar:1
          }
         }
        ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    }
  ])
  if (!userAgg || userAgg.length === 0) {
    throw new ApiError(402, "user history not found");
  }
  return res.status(200).json(
    new ApiResponse(200,userAgg[0]?.watchHistory,"history fetched successfully")
  )
 })
//update avatar