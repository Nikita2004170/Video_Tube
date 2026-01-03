import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
//import { pipeline } from "nodemailer/lib/xoauth2/index.js";
export const videoLike = asyncHandler(async (req, res) => {
  const { videoid } = req.params;
  if (!mongoose.isValidObjectId(videoid)) {
    throw new ApiError(402, "videoid is not valid");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError("402", "user not found");
  }
const existedLike = await Like.findOne({
  likedby: user._id,
  likevideo: videoid,
});
  //console.log(existedLike.likedby);
  if (existedLike) {
    const deleteLike = await Like.findByIdAndDelete(existedLike._id);
    if (!deleteLike) {
      throw new ApiError(402, "like not toggeled");
    }
  } else {
    const newLike = await Like.create({
     likedby: user._id,
  likevideo: videoid,
    });
    if (!newLike) {
      throw new ApiError(402, "like not counted");
    }
  }
  return res.status(200).json(new ApiResponse(200, "like is toggler or liked"));
});
export const commentlike = asyncHandler(async (req, res) => {
  const { commentid } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError("402", "user not found");
  }
  const existedLike = await Like.findOne({
    likedby: user._id,
    likecomment: commentid,
  });
  if (existedLike) {
    const deleteLike = await Like.findByIdAndDelete(existedLike._id);
    if (!deleteLike) {
      throw new ApiError(402, "like not toggeled");
    }
  } else {
    const newLike = await Like.create({
    likedby: user._id,
    likecomment: commentid,
    });
    if (!newLike) {
      throw new ApiError(402, "like not counted");
    }
  }
  return res.status(200).json(new ApiResponse(200, "like is toggler or liked"));
});
export const tweetlike = asyncHandler(async (req, res) => {
  const { tweetid } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError("402", "user not found");
  }
  const existedLike = await Like.findOne({
    likedby:user._id,
    liketweet: tweetid,
  });
  if (existedLike) {
    const deleteLike = await Like.findByIdAndDelete(existedLike._id);
    if (!deleteLike) {
      throw new ApiError(402, "like not toggeled");
    }
  } else {
    const newLike = await Like.create({
     likedby:user._id,
    liketweet: tweetid,
    });
    if (!newLike) {
      throw new ApiError(402, "like not counted");
    }
  }
  return res.status(200).json(new ApiResponse(200, "like is toggler or liked"));
});
export const getAllVideoLike = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedby: new mongoose.Types.ObjectId(req.user._id),
        likevideo: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "likevideo",
        foreignField: "_id",
        as: "liked_videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "video_owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$video_owner" },
            },
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              videofile: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        liked_videos: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
  );
});

