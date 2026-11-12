import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { createClient } from '@supabase/supabase-js'; 

import deviceRouter from './routes/deviceRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import studentRouter from "./routes/studentRouter.js";
import userRouter from "./routes/userRouter.js";
import officerRouter from "./routes/OfficerRouter.js";
import qrRouter from "./routes/qrRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRateLimiter, loginRateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.originalUrl}`);
  next();
});

// Rate limiting
app.use('/api/user', loginRateLimiter);
app.use('/api/', apiRateLimiter);

// Routes
app.use('/api/devices', deviceRouter);
app.use('/api/user', userRouter);
app.use('/api/officer', officerRouter);
app.use('/api/student', studentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/qr', qrRouter);

// Test route
app.get("/", (req, res) => {
    res.send("Backend working!");
});

// 404 handler for unmatched routes
app.use((req, res) => {
  console.log(`⚠️ 404 Not Found: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Root test: http://localhost:${PORT}/`);
    console.log(`🔗 Admin login: http://localhost:${PORT}/api/user/admin`);
});
