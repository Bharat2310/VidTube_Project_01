import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verify } from "jsonwebtoken";
import verifyJWT from "../middlewares/auth.middleware.js"

const UserRouter = Router()

UserRouter.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }, 
        {
            name : "coverimage",
            maxCount : 1
        }
    ]),
    registerUser
)

UserRouter.route("/login").post(
    loginUser
)


//secured routes
UserRouter.route("/logout").post(
    verifyJWT, logoutUser
)


export default UserRouter   