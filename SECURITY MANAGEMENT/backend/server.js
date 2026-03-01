import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import deviceRouter from './routes/deviceRouter.js'
import dashboardRouter from './routes/dashboardRouter.js'
import studentRouter from "./routes/studentRouter.js";
import userRouter from "./routes/userRouter.js"
import officerRouter from "./routes/OfficerRouter.js";
import qrRouter from "./routes/qrRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRateLimiter, loginRateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

// Rate limiting
app.use('/api/user', loginRateLimiter);
app.use('/api/', apiRateLimiter);

// Routes
app.use('/api/devices', deviceRouter)
app.use('/api/user', userRouter)
app.use('/api/officer', officerRouter)
app.use('/api/student', studentRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/qr', qrRouter)

// Test route
app.get("/", (req, res) => {
    res.send("Backend working!");
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
