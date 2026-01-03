import { body, ExpressValidator } from "express-validator";
export const userValidator=()=>{
    return [
        body('username')
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({min:3,max:15})
        .withMessage("Username must be between 3 and 30 characters long"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),
        
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
         .isEmail()
        .withMessage("Invalid email address")
    ]
}
export const forgotPasswordValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    ]
}
export const resetPasswordValidator = ()=>{
    return[
        body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

    ]
}
export const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldpassword").notEmpty().withMessage("Old password is required"),
    body("newpassword").notEmpty().withMessage("New password is required"),
  ];
};