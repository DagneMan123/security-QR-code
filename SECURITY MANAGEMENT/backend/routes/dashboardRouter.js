import express from "express"
import { getDashboardStats } from "../controllers/dashboardController.js";


const dashboardRouter = express.Router()
dashboardRouter.get('/list', getDashboardStats);


export default dashboardRouter