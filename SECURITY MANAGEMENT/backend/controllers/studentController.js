import { Device, Student } from "../models/index.js";

export const listStudent = async (req, res) => {
  try {
    const student = await Student.findAll();

    return res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message
    });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const photoUrl = req.file ? req.file.path : null;

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }

    const { studentId, fullName, email, phone, password, department, deviceId } = req.body;

    const newStudent = await Student.create({
      studentId,
      fullName,
      email,
      phone,
      password,
      department,
      deviceId,
      imageUrl: photoUrl
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: newStudent
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};