import {validationResult} from "express-validator";
import { ApiError } from "../utils/apiError.js";
export const validatorMiddleware=(req,res,next)=>{
    const error=validationResult(req);
    if(error.isEmpty()){
        return next();
    }
    const extractedArray=[];
    error.array().map((err)=>
        extractedArray.push({[err.param]:err.msg})
    )
    throw new ApiError(400,"Validation Error",extractedArray);

}