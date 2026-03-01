import { Student, Device } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and password are required"
      });
    }

    const student = await Student.findOne({ where: { studentId } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = createToken(student.studentId);

    const studentData = {
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      deviceId: student.deviceId,
      department: student.department,
      phone: student.phone
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: studentData
    });
  } catch (error) {
    console.error("Student login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const studentProfile = async (req, res) => {
  try {
    const { studentId } = req.user;

    const student = await Student.findOne({
      where: { studentId },
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const device = await Device.findOne({
      where: { deviceId: student.deviceId }
    });

    return res.status(200).json({
      success: true,
      data: {
        ...student.toJSON(),
        device: device ? {
          deviceId: device.deviceId,
          status: device.status,
          isBlocked: device.isBlocked
        } : null
      }
    });
  } catch (error) {
    console.error("Student profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const checkInDevice = async (req, res) => {
  try {
    const { studentId } = req.user;
    const { qrData } = req.body;

    const student = await Student.findOne({ where: { studentId } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (!student.deviceId) {
      return res.status(400).json({
        success: false,
        message: "Student has no device assigned"
      });
    }

    const device = await Device.findOne({
      where: { deviceId: student.deviceId }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    if (device.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Device is blocked"
      });
    }

    device.status = "login";
    device.isLoggedOut = false;
    const savedDevice = await device.save();

    console.log("Device checked in successfully:", savedDevice.deviceId);

    return res.status(200).json({
      success: true,
      message: "Device checked in successfully",
      data: savedDevice
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message
    });
  }
};

export const checkOutDevice = async (req, res) => {
  try {
    const { studentId } = req.user;

    const student = await Student.findOne({ where: { studentId } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (!student.deviceId) {
      return res.status(400).json({
        success: false,
        message: "Student has no device assigned"
      });
    }

    const device = await Device.findOne({
      where: { deviceId: student.deviceId }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    // Update status and isLoggedOut flag
    device.status = "logout";
    device.isLoggedOut = true;
    const savedDevice = await device.save();

    console.log("Device checked out successfully:", savedDevice.deviceId);

    return res.status(200).json({
      success: true,
      message: "Device checked out successfully",
      data: savedDevice
    });
  } catch (error) {
    console.error("Check-out error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message
    });
  }
};
