import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
 import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.models.js";
 export const tweetUser=asyncHandler(async(req ,res)=>{
  try {
      const {message}=req.body;
      const user=await User.findById (req.user._id);
      if(!user){
          throw new ApiError(404,"user not found");
      }
      
      const tweet = await Tweet.create({
  content: message,
  owner: user._id
});
      console.log(tweet.content);
        await user.save({ validateBeforeSave: false });

      if(!tweet){
          throw new ApiError(409,"tweet not published");
      }
      res.status(201).json(
              new ApiResponse(200,tweet.content,"tweet published successfully")
      );
  } catch (err) {
              throw new ApiError(500,"something went wrong while creating tweet");

  }

 });
 export const updateTweet= asyncHandler(async(req,res)=>{
    const {tweetid}=req.params;
    const {content}=req.body;
 const user = await User.findById(req.user.id);
  if (!user){
    throw new ApiError("402", "user not found");
  }
const tweet=await Tweet.findById(tweetid);
if(!tweet){
    throw new ApiError(404,"tweet not found");
}
if(tweet.owner.toString() !=user._id.toString()){
        throw new ApiError(402,"you are not authenticated to  update this tweet");
}
const updatedtweet=await Tweet.findByIdAndUpdate(
    tweetid,
    {content},
    {new:true}
);
if(!updatedtweet){
    throw new ApiError(402,"tweet not updated");
}
return res.json(
    new ApiResponse(200,updatedtweet.content,"tweet updated successfully")
)
 });
 export const deleteTweet= asyncHandler(async (req, res)=>{
    const{tweetid}= req.params;
 const user = await User.findById(req.user.id);
  if (!user){
    throw new ApiError("402", "user not found");
  }
const tweet= await Tweet.findById(tweetid);
 if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }
if(tweet.owner.toString() !=user._id.toString()){
        throw new ApiError(402,"you are not authenticated to delete this tweet");
}
const deleteTweet= await Tweet.findByIdAndDelete(tweetid);
if(!deleteTweet){
    throw new ApiError(404,"tweet is not deleted");
}
return res.status(200).json(
    new ApiResponse(200,"tweet deleted successfully")
)
});
export const getAllTweet=asyncHandler(async (req,res)=>{
    const { page = 1, limit = 10 } = req.query;
    const user = await User.findById(req.user.id);
  if (!user){
    throw new ApiError("402", "user not found");
  }
    const tweet=await Tweet.aggregate(
        [
          {
            $match:{
               owner:user._id ,
            content: { $exists: true },

            }
          } ,
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
                localField:"owner",
                foreignField:"_id",
                as:"tweetedlist",
            }
          },
          {
                  $unwind: "$tweetedlist",
          },
          {
            $lookup:{
                from:"likes",
                 localField: "_id",
                foreignField:"liketweet",
                as:"likeInfo",
            }
          },
          {
            $addFields:{
                likeCount:{$size:"$likeInfo"},
                likedByCurrentUser: {
  $cond: {
    if: { $gt: [{ $size: "$likeInfo" }, 0] },
    then: { $in: [user._id, "$likeInfo.likedby"] },
    else: false,
  },
}
            }
          },
            {
      $project: {
        _id: 0,
        createdAt: 1,
        updatedAt: 1,
        likeCount: 1,
        likedByCurrentUser: 1,
        tweetid: "$_id",
        content: "$content",
        username: "$tweetedlist.username",
        fullname: "$tweetedlist.fullname",
        avatar: "$tweetedlist.avatar",
      },
    }, 
        ]);
        if(!tweet){
            throw new ApiError("402","tweet not fetched");
        }
        return  res.status(200).json(
            new ApiResponse(200,tweet,"tweet fetched successfully")
        )

})