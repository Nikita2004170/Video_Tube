import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const commentSchema = mongoose.Schema(
  {
     content: {
      type: String,
      req: true,
    },
    commentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    commenttweet:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    commentvideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  {
    timestamp: true,
  }
);
commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
