import { Router } from "express";
import registerUser from "../controllers/user.comtroller.js";

const UserRouter = Router()

UserRouter.route("/register").post(registerUser)

export default UserRouter   