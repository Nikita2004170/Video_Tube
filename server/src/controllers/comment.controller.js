import {Comment} from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

export const addCommentInVideo=asyncHandler (async(req , res)=>{
const {content}=req.body;
const {videoid}=req.params;
 if (!mongoose.isValidObjectId(videoid)) {
    throw new ApiError(402, "videoid is not valid");
  }
   const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError("402", "user not found");
  }
const newComment= await Comment.create({
    content:content,
    commentby:user,
commentvideo: videoid,
});
if(!newComment){
    throw new ApiError(402,"comment not added")
}
return res.status(200).json(
    new ApiResponse(200,newComment.content,"commented successfully")
)
});
export const updateComment=asyncHandler( async( req ,res)=>{
    const {content}=req.body;
    const {commentid}=req.params;
   const user = await User.findById(req.user.id);
  if (!user){
    throw new ApiError("402", "user not found");
  }
  const comment = await Comment.findById(commentid);
  if(!comment){
    throw new ApiError(402,"no comment found")
  }
  if(comment.commentby.toString() !=user._id.toString()){
    throw new ApiError(402,"you are not authenticated to  update this comment")
  }
const updateComment=await Comment.findByIdAndUpdate(
    commentid,
    {content},
{new:true}
)
 if(!updateComment){
        throw new ApiError(402,"comment not updated")
 }
 return res.status(201).json(
    new ApiResponse(200,updateComment.comment,"comment updated successfully")
 )
})
export const addCommentInTweet=asyncHandler (async(req , res)=>{
const {content}=req.body;
const {tweetid}=req.params;
 if (!mongoose.isValidObjectId(tweetid)) {
    throw new ApiError(402, "videoid is not valid");
  }
   const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError("402", "user not found");
  }
const newComment= await Comment.create({
    content:content,
    commentby:user,
commenttweet: tweetid,
});
if(!newComment){
    throw new ApiError(402,"comment not added")
}
return res.status(200).json(
    new ApiResponse(200,newComment.content,"commented successfully")
)
});
export const deleteComment= asyncHandler(async (req, res)=>{
    const {commentid}=req.params;
    console.log("hello")
    const user=await User.findById(req.user.id);
    if (!user){
    throw new ApiError("402", "user not found");
  }
  const comment=await Comment.findById(commentid);
  if(!comment){
    throw new ApiError(402,"no comment found")
  }
   if(comment.commentby.toString() !=user._id.toString()){
    throw new ApiError(402,"you are not authenticated to delete this comment")
  }
const deleteComment=await Comment.findByIdAndDelete(commentid);
if(!deleteComment){
        throw new ApiError(402,"comment not deleted")
 }
 return res.status(200).json(
    new ApiResponse(200,"comment deleted successfully")
 )

});
//For each comment:
  // ├─ Who wrote it?
  // ├─ Did I like it?
  // └─ How many likes does it have?

export const getAllComment=asyncHandler(async (req,res)=>{
const {videoid}=req.params;
const { page = 1, limit = 10 } = req.query;
 if (!videoid) {
    throw new ApiError(400, "videoId is required");
  }
  if (!mongoose.isValidObjectId(videoid)) {
    throw new ApiError(402, "videoid is not valid");
  }
  const videoComment= await Comment.aggregate([
    {
      $match: {
      commentvideo:new mongoose.Types.ObjectId(videoid) //fiels of comment schema are both video id eqal
      }
    },
    {
      $sort:{
        createdAt:-1
      }
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
    {
      $lookup:{
        from:"users",
        localField:"commentby",
        foreignField:"_id",
        as:"commentOwner"
      }
    },
    {
      $unwind: "$commentOwner",
    },
    // Check if CURRENT USER liked this comment
  //   {
  //     $lookup:{
  //       from:"likes",
  //       let:{commentId:"$_id"}, //passes current comment _id
  //        pipeline:[
  //        { 
  //         $match:{
  //           $expr:{
  //             $and:[
  //             { $eq:["$likecomment","$$commentId"]}, 
  //             { $eq:["$likedby",new mongoose.Types.ObjectId(req.user._id),]}
  //             ]
  //           }
  //         }
  //       }
  //        ],
  //        as:"likedByUser"
  //     }
  //   },
  //   {
  //     $addFields: {
  //       liked: { $gt: [{ $size: "$likedByUser" }, 0] }, //liked is a NEW FIELD that we are CREATING
  //     },
  //   },
  //   {
  //     $lookup:{
  //       from:"likes",
  //      let: { commentId: "$_id" },
  //      pipeline:[
  //       {
  //         $match:{
  //           $expr:{
  //           $eq: ["$likecomment", "$$commentId"],
  //           }
  //         }
  //       }
  //      ],
  //      as:"totalLike"
  //     }
  //   },
  //   { 
  //     $addFields: {
  //       likedCount:{$size: "$totalLike"}
  //   }
  // },
  // {
  //   $project:{
  //     content:1,
  //    likedByUser:1,
  //     totalLike:1,
  //     commentby:
  //     {
  //       username: "$commentOwner.username",
  //         avatar: "$commentOwner.avatar",
  //     }

  //   }
  
  //}
  {
  $lookup: {
    from: "likes",
    let: { commentId: "$_id" }, // ✅ correct: field reference
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$likecomment", "$$commentId"] }, // comment match
              {
                $eq: [
                  "$likedby", // ✅ exact schema field name
                  new mongoose.Types.ObjectId(req.user._id),
                ],
              },
            ],
          },
        },
      },
    ],
    as: "likedByUser",
  },
},
{
  $addFields: {
    liked: {
      $gt: [{ $size: "$likedByUser" }, 0], // boolean liked flag
    },
  },
},
{
  $lookup: {
    from: "likes",
    let: { commentId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$likecomment", "$$commentId"],
          },
        },
      },
    ],
    as: "totalLike",
  },
},
{
  $addFields: {
    likedCount: { $size: "$totalLike" }, // ✅ array → number
  },
},
{
  $project: {
    content: 1,
    liked: 1,
    likedCount: 1,

    // 🔍 DEBUG FIELDS (optional – remove later)
    // likedByUser: 1,
    // totalLike: 1,

    commentby: {
      username: "$commentOwner.username",
      avatar: "$commentOwner.avatar",
    },
  },
}

  ]);
  if(!videoComment || videoComment.length===0){
        throw new ApiError(404, "No comments found for this video");
  }
  return res.status(200).json(
    new ApiResponse(200,videoComment,"comments fetched successfully!")
  )

})