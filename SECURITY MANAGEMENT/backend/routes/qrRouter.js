import express from "express";
import { generateQRCode, validateQRCode } from "../controllers/qrController.js";

const qrRouter = express.Router();

qrRouter.get('/generate/:deviceId', generateQRCode);
qrRouter.post('/validate', validateQRCode);

export default qrRouter;
