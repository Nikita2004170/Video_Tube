import { Subscriptions } from "../models/subscription.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//  subscribers:[{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     }],
    
//      channel:[{
//          type: mongoose.Schema.Types.ObjectId,
//           ref: "User"
//          }]
//     },
export const toggleSubscription=asyncHandler(async (req , res)=>{
const {channelId}=req.params;
const user= await User.findById(req.user._id);
if(!user){
    throw new ApiError(402,"user not found");
}
const isSubscribed= await Subscriptions.findOne({
      subscribers:user._id,
      channel:channelId
})
if(isSubscribed){
    const toggleSubscribe=await Subscriptions.findByIdAndDelete(isSubscribed._id);
;
    if(!toggleSubscribe){
        throw new ApiError(402,"subcription not toggled");
    }
}
const subscribe=await Subscriptions.create({
   subscribers:user._id,
   channel:channelId
})
if(!subscribe){
    throw new ApiError(402,"channel not subscribed")
}
return res.status(201).json(
    new ApiResponse(201,"channel subscribed successfully"));
});
export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const subscribedChannels = await Subscriptions.aggregate([
    // Find subscriptions where I am subscriber
    {
      $match: {
        subscribers: user._id,
          //subscribers: { $in: [user._id] },

      },
    },

    // Join channel user details
    {
      $lookup: { //
        from: "users",
        localField: "channel", // channel joined with user collection
        foreignField: "_id",
        as: "channelInfo",
      },
    },

    // Flatten channelInfo array
    {
      $unwind: "$channelInfo",
    },

    // Final shape
    {
      $project: {
        _id: 0,
        channelId: "$channelInfo._id",
        username: "$channelInfo.username",
        fullname: "$channelInfo.fullname",
        avatar: "$channelInfo.avatar",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      subscribedChannels,
      "Subscribed channels fetched successfully"
    )
  );
});
export const getSubscriberCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Channel user not found");
  }

  const subscribers = await Subscriptions.aggregate([
    {
      $match: {
        channel: user._id
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribers",
        foreignField: "_id",
        as: "subscriberDetails"
      }
    },
    {
      $unwind: "$subscriberDetails"
    },
    {
      $project: {
        _id: 0,
        fullname: "$subscriberDetails.fullname",
        username: "$subscriberDetails.username",
        avatar: "$subscriberDetails.avatar"
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscriberCount: subscribers.length,
        subscribers
      },
      "Subscribers fetched successfully"
    )
  );
});
