import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudanary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
   // get user details 
   // validate user info 
   // check if user alredy exists -- email username
   // check user avatar
   // upload them to cloudinary , avatar(specially)
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return response
   const {username , email, fullname, password} = req.body;
   console.log(`email : ${email}`);
   
    if (
        [username, email, fullname, password].some((x) => x?.trim() === "")
    ) {
        throw new ApiError(400 , "all fields are required")
    }
     let emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     const result = emailRegEx.test(email)
     if (!result) {
        throw new ApiError(400 , "enter correct email address")
     }

     const Existence = await User.findOne(
        {
            $or : [{fullname}, {email}]
        }
     )
     if (Existence) {
        throw new ApiError(409, "username taken or email id already exists")
     }

     const avatarPath = req.files?.avatar[0]?.path
     const coverimagePath = req.files?.coverimage[0]?.path

     if (!avatarPath) {
        throw new ApiError(400,  "avatar is needed ")      
     }
     const avatarUploaded = await uploadOnCloudinary(avatarPath)
     const coverimageUploaded = await uploadOnCloudinary(coverimagePath)

     if (!avatarUploaded) {
        throw new ApiError(400, "avatar is needed ")
        
     }
     const user = await User.create({
        fullname,
        avatar : avatarUploaded.url,
        coverimage : coverimageUploaded.url || "",
        email,
        password,
        username: username.toLowerCase() 
     })
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if (!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
     }
     return res.status(201).json(
        new ApiResponse(200, createdUser, "user created Successfully")
     )
    
} )

export {
    registerUser
}