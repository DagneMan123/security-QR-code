import express from "express"
import { Add, changePassword, GetAll, getSingleOfficer, removeOfficer, securityLogin, securityProfile, toggleOfficerStatus, updateOfficer, updateProfile } from "../controllers/OfficerController.js";
import { verifyToken, verifyAdmin, verifySecurity } from "../middleware/auth.js";

const officerRouter = express.Router()

// Public routes
officerRouter.post('/login', securityLogin);

// Protected routes - Security Officer (must come before admin routes with :officerId)
officerRouter.get('/profile', verifyToken, verifySecurity, securityProfile);
officerRouter.patch('/change-password', verifyToken, verifySecurity, changePassword);
officerRouter.patch('/update-profile', verifyToken, verifySecurity, updateProfile);

// Protected routes - Admin only (specific routes before generic :officerId routes)
officerRouter.get('/list', verifyToken, verifyAdmin, GetAll);
officerRouter.post('/add', verifyToken, verifyAdmin, Add);
officerRouter.patch('/:officerId/status', verifyToken, verifyAdmin, toggleOfficerStatus);
officerRouter.delete('/:officerId', verifyToken, verifyAdmin, removeOfficer);
officerRouter.patch('/:officerId', verifyToken, verifyAdmin, updateOfficer);
officerRouter.put('/:officerId', verifyToken, verifyAdmin, updateOfficer);
officerRouter.get('/:officerId', verifyToken, verifyAdmin, getSingleOfficer);

export default officerRouter
