import mongoose from "mongoose";
import bcrypt from  "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
const userShema =new mongoose.Schema({
avatar:{
      type: {
        url: String,
        localpath: String,
      },
        default: {
        url: "https://www.istockphoto.com/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-gm1451587807-488238421",
        localpath: "",
      },
},
// avatar: {
//   url: {
//     type: String,
//     required: true,
//   },
// },
username:{
    type:String,
    unique:true,
    trim:true,
    lowercase:true,
    required:true,
},
email:{
    type:String,
    unique:true,
    trim:true,
    lowecase:true,
    required:true,
},
password:{
type:String,
trim:true,
required:true,
},
refreshToken:{
    type:String
},
forgotPasswordToken:{
    type:String
},
forgotPasswordTokenExpiry:{
    type:Date
}
},
{
Timestamp:true
});

userShema.pre("save",async function (next) {
  if(!this.isModified("password")){
    return;
  }  
  this.password= await bcrypt.hash(this.password,10);

});
//userschemamethod
userShema.methods.isPasswordCorrect=async function(password){
  return  await bcrypt.compare(password, this.password);
};
userShema.methods.generateAccessToken= function(){
    return jwt.sign(
       { _id:this._id,
        username:this.username,
        email:this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_SECRET_EXPIRY
}
    )
};
userShema.methods.generateRefreshToken= function(){
   return jwt.sign({
        _id:this._id,
        email:this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_SECRET_EXPIRY
    }
)
};
userShema.methods.generateTemperoryToken= function(){
     const unhashedToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");
    const tokenExpiry = Date.now() + 10 * 60 * 1000;
    this.forgotPasswordToken=hashedToken,
    this.forgotPasswordTokenExpiry=tokenExpiry
      return { unhashedToken, hashedToken, tokenExpiry };
}
export const User = mongoose.model("User", userShema);
