import express from "express"
import { adminLogin, officerLogin } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post('/admin', adminLogin);
userRouter.post('/officer', officerLogin);

export default userRouter