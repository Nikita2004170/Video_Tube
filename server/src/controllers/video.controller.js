import { Video } from "../models/videofile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { title } from "process";
export const videoUpload = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnailFile?.[0]?.path;
console.log(title);
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(402, "user not found");
    }
    console.log("REQ.FILES --->", req.files);

    if (!videoLocalPath) {
      throw new ApiError(402, "file not uploaded");
    }
    if (!thumbnailLocalPath) {
      throw new ApiError(401, "thumbnail not found");
    }
    const uploadFile =await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail =await uploadOnCloudinary(thumbnailLocalPath);

console.log("Cloudinary Video URL:", uploadFile.secure_url);
console.log("Cloudinary Thumbnail URL:", uploadThumbnail.secure_url);
    if (!uploadFile) {
      throw new ApiError(402, "file not uploaded on cloudinary");
    }

    const video = await Video.create({
      videourl: uploadFile.secure_url,
      owner: user._id,
      title,
      description,
      thumbnail: uploadThumbnail.secure_url,
      ispublised: true,
    });
    if (!video) {
      throw new ApiError(402, "video not uploaded ");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, "video uploaded successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong while uploading video");
  }
});
 export const getAllvideo=asyncHandler(async(req, res)=>{
const {page=1,limit=10, query, sortBy, sortType,userId}=req.query;
const video=await Video.aggregate([
  {
    $match:{
      $or:[
        {
          title:{$regex:query,$options:"i"},
        },
        {
          description:{$regex:query,$options:"i"}
        }
      ]
    }
  },
  {
    $lookup:{
      from:"users",
      localField:"owner",
      foreignField:"_id",
      as:"video_owner"
    }
  },//$lookup ALWAYS creates an array — even if there is only one matching document.
  {
      $unwind: "$video_owner",
    },

{
  $project:{
    thumbnail:1,
    videoFile:1,
    title:1,
    description:1,
    duration:1,
     "video_owner.username": 1,
    "video_owner.avatar": 1,
  }
},
{
  $sort:{
      [sortBy]: sortType == "asc" ? 1 : -1,
  }
},
{
    $skip: (parseInt(page) - 1) * parseInt(limit),
},
{
   $limit: parseInt(limit),
}
]);
if(!video){
  throw new ApiError(401,"videos not fetched ");
}
return res.status(200).json(
  new ApiResponse(200, video ,"video fetched successfully")
)

 })
//  [
//   { title: "A", video_owner: { username: "ram", avatar: "img1" } },
//   { title: "B", video_owner: { username: "shyam", avatar: "img2" } },
//   { title: "C", video_owner: { username: "ram", avatar: "img1" } },
// ]

 export const getVideoById=asyncHandler(async (req ,res)=>{
  const {videoUrl}= req.params;
const user=await User.findById(req.user._id);
if(!user){
  throw new ApiError(404,"user not found");
}
const video=await Video.findOne({ videourl: videoUrl });
if (!video) {
    throw new ApiError(404, "Video not found");
  }

 });
export const getVideoByChannel = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

  //  Find channel user
  const channelUser = await User.findOne({ username });
  if (!channelUser) {
    throw new ApiError(404, "Channel not found");
  }

  // Fetch videos of that user
  const videos = await Video.aggregate([
    {
      $match: {
        owner: channelUser._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "videoOwnerChannel",
      },
    },
    { $unwind: "$videoOwnerChannel" },
    {
      $project: {
        thumbnail: 1,
        videoFile: 1,
        title: 1,
        description: 1,
        duration: 1,
        "videoOwnerChannel.username": 1,
        "videoOwnerChannel.avatar": 1,
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  );
});

export const videoDelete =asyncHandler (async (req ,res)=>{
 const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(402, "user not found");
    }
    const {videoid}=req.params;
    if(!videoid){
            throw new ApiError(402, "video not required");
    }
     if (!mongoose.Types.ObjectId.isValid(videoid)) {
    throw new ApiError(401, "VideoId is not valid");
  }
    const deletevideo= await Video.findByIdAndDelete(videoid)
    if(!deletevideo){
          throw new ApiError(404, "Video not found");
    }
    await deleteFromCloudinary(deletevideo.videourl);
      await deleteFromCloudinary(deletevideo.thumbnail);

return res.status(201).json(
  new ApiResponse(200,"video deleted successfully")
);
})