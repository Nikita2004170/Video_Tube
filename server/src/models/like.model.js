import mongoose from "mongoose"
const likeSchema=mongoose.Schema(
    {
        likedby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        likevideo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        },
        liketweet:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tweet"
        },
        likecomment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }

},
{
    timestamp:true
});
export const Like=mongoose.model("like", likeSchema);