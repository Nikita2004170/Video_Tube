import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videofileSchema=mongoose.Schema({
    videourl:{
        type:String,//cloudinary url
        reuired:true,
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },
    thumbnail:{
        type:String,
         required:true
    },
    title:{
        type:String,
         required:true
    },
    description:{
        type:String,
         required:true
    },
    views:{
        type:Number
    },
    duration:{
        type:Number
    },
    isPublised:{
        type:Boolean,
        default:true
    },
        watchHistory:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    
},{
    Timestamp:true
})
videofileSchema.plugin(mongooseAggregatePaginate);
export const Video=mongoose.model("Video",videofileSchema);