import mongoose from "mongoose";

 const subscriptionSchema=mongoose.Schema(
    {
    subscribers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
     channel:{
         type: mongoose.Schema.Types.ObjectId,
          ref: "User"
         }
    },
    {
        timestamp:true
    }
);
export const Subscriptions=mongoose.model("Subscriptions",subscriptionSchema);