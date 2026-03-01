import express from "express";
import { BlockDevice, blockInfo, decryptQR, getDeviceByOwner, listDevice, registerDevice, removeDevice, singleDevice, todayInfo, toggleBlockDevice, updateDeviceStatus, updateInfo, setDevicesBlocked, setAllDevicesLogout, setAllDevicesActive, setAllDevicesInactive } from "../controllers/deviceController.js";
import upload from "../middleware/multer.js";
import { verifyToken, verifyAdmin, verifySecurity } from "../middleware/auth.js";

const deviceRouter = express.Router();

// Public routes
deviceRouter.post('/add', upload.single("ownerPhoto"), registerDevice);
deviceRouter.get('/list', listDevice);
deviceRouter.get('/single', singleDevice);
deviceRouter.post('/decrypt', decryptQR);

// Protected routes - Admin only
deviceRouter.delete('/:deviceId', verifyToken, verifyAdmin, removeDevice);
deviceRouter.put('/update/:deviceId', verifyToken, verifyAdmin, updateInfo);
deviceRouter.post('/set-blocked', verifyToken, verifyAdmin, setDevicesBlocked);

// Protected routes - Admin or Security Officer
deviceRouter.post('/set-all-logout', verifyToken, setAllDevicesLogout);
deviceRouter.post('/set-all-active', verifyToken, setAllDevicesActive);
deviceRouter.post('/set-all-inactive', verifyToken, setAllDevicesInactive);

// Protected routes - Admin or Security Officer
deviceRouter.patch('/update/:deviceId/status', verifyToken, updateDeviceStatus);
deviceRouter.patch('/update/:deviceId/block', verifyToken, verifyAdmin, toggleBlockDevice);
deviceRouter.patch('/officer/:deviceId/block', verifyToken, verifySecurity, BlockDevice);

// Info routes
deviceRouter.get('/today-info', todayInfo);
deviceRouter.get('/block-info', blockInfo);
deviceRouter.get("/by-owner/:ownerId", getDeviceByOwner);

export default deviceRouter;
