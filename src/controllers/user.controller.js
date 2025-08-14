import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudanary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const generateRefreshAccessToken = async(userID) => {
   try {
      const user  = await User.findById(userID)
      const refreshToken = user.generateRefreshToken()
      const accessToken = user.generateAccessToken()
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave : false })
      return {accessToken, refreshToken}

   } catch (error) {
      throw new ApiError(404, "something went wrong while generating refresh and access token")
      
   }
}

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
            $or : [{username}, {email}]
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
      // "-refreshToken"
     )
     if (!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
     }
     return res.status(201).json(
        new ApiResponse(201, createdUser, "user created Successfully")
     )
    
} )

const loginUser = asyncHandler(async (req, res) => {
   // req body -- data
   // access through username or email
   // find the user 
   // check for password
   // access and refresh token
   // refresh and access in cookie
   // send response
   const {username,  email, password} = req.body

   if (!username && !email ) {
      throw new ApiError(400, "username or password is compulsary")
   }
   })
   const user = await User.findOne({
      $or : [{username}, {email}]
   })

   if(!user) {
      throw new ApiError(404, "User Not found")
   }

   const passCheck = await user.checkPassword(password)

   if(!passCheck){
      throw new ApiError(401, "Password is not Correct")
   }
   
   const {accessToken, refreshToken} = await generateRefreshAccessToken(user._id)

   const loggedInUser = await User.findById(_id).select("-password -refreshToken")
   
   const Options = {
      httpOnly : true,
      secure : true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, Options)
   .cookie("refreshToken", refreshToken, Options)
   .json(
      new ApiResponse(200, {
         user : loggedInUser,
         accessToken,
         refreshToken
      }, "user logged In successfully")
   ) 
const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User not found in request" });
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: "" // Proper way to remove the field
            }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

export {
    registerUser,
    loginUser,
    logoutUser    
}