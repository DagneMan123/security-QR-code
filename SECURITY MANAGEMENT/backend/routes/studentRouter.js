import express from "express";
import { listStudent, registerStudent } from "../controllers/studentController.js"; // registerStudent ጨምር
import { studentLogin, studentProfile, checkInDevice, checkOutDevice } from "../controllers/studentAuthController.js";
import { verifyToken, verifyStudent } from "../middleware/auth.js";
import upload from "../config/cloudinary.js"; 

const studentRouter = express.Router();

// --- 1. Public routes ---
studentRouter.post('/register', upload.single('imageUrl'), registerStudent); 

studentRouter.post('/login', studentLogin);

// --- 2. Protected routes ---
studentRouter.get('/list', listStudent);
studentRouter.get('/profile', verifyToken, verifyStudent, studentProfile);
studentRouter.post('/check-in', verifyToken, verifyStudent, checkInDevice);
studentRouter.post('/check-out', verifyToken, verifyStudent, checkOutDevice);

export default studentRouter;