import express from "express"
import {validatorMiddleware} from "../middlewares/validator.middleware.js"
import {verficationJWT} from "../middlewares/jwt.verification.js"
import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js";

import {userValidator,forgotPasswordValidator,resetPasswordValidator,userChangeCurrentPasswordValidator} from "../validators/user.validators.js"
import {registerUser ,login, logout,forgotPassword,resetPassword,updatePassword,accessTokenGeneration,updateUserDetail, getUserDetail} from "../controllers/user.controllers.js";
import {videoUpload,videoDelete } from "../controllers/video.controller.js"
const router=Router();
router.post("/register",upload.fields([{ name: "avatar", maxCount: 1 }]),userValidator(),validatorMiddleware,registerUser)
router.post("/login",login)
router.post("/forgotpassword",forgotPasswordValidator(),validatorMiddleware,forgotPassword)
router.post("/resetpassword/:resetToken",resetPasswordValidator(),validatorMiddleware,resetPassword)
//secure route
//userroutes
router.post("/logout",verficationJWT,logout)
router.put("/updatepassword",verficationJWT,updatePassword)
router.post("/generateaceesstoken",verficationJWT,accessTokenGeneration)
router.post("/updateusername",verficationJWT, updateUserDetail);
router.post("/getuserdetail/:username",verficationJWT,getUserDetail);
router.post("/getuserdetail",verficationJWT,getUserDetail);
//tweet
import {tweetUser,updateTweet,deleteTweet,getAllTweet} from "../controllers/tweet.controller.js"
router.post("/tweet",verficationJWT,tweetUser);
router.post("/updatedtweet/:tweetid",verficationJWT,updateTweet);
router.post("/deletetweet/:tweetid",verficationJWT,deleteTweet);
router.post("/getalltweet",verficationJWT,getAllTweet);

//video routes
router.post(
  "/videoupload",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 }
  ]),
  verficationJWT,
  videoUpload
);
router.post("/deletevideo/:videoid",verficationJWT,videoDelete);
//comment
import {addCommentInVideo ,addCommentInTweet,updateComment,deleteComment,getAllComment} from "../controllers/comment.controller.js"
router.post("/addcommentvideo/:videoid",verficationJWT,addCommentInVideo);
router.post("/addcommenttweet/:tweetid",verficationJWT,addCommentInTweet);
router.post("/updatecomment/:commentid",verficationJWT,updateComment);
router.post("/deletecomment/:commentid",verficationJWT,deleteComment);
router.post("/getallvideo/:videoid",verficationJWT,getAllComment);
//like
import {videoLike, commentlike ,tweetlike,getAllVideoLike} from "../controllers/like.controller.js"
router.post("/likevideo/:videoid",verficationJWT,videoLike);
router.post("/likecomment/:commentid",verficationJWT,commentlike);
router.post("/liketweet/:tweetid",verficationJWT,tweetlike);
router.get("/likedvideos",verficationJWT,getAllVideoLike)

//subscription
import {toggleSubscription,getSubscriberCount,getSubscribedChannels} from "../controllers/subscription.controller.js"
router.post("/toggleubscription/:channelId",verficationJWT,toggleSubscription);
router.post("/getsubscribedchannels/:userId",verficationJWT,getSubscribedChannels);
router.post("/getsubscriber/:userId",verficationJWT,getSubscriberCount);
export default router;