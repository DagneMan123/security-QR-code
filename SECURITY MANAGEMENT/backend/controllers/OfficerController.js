import { SecurityOfficer } from "../models/index.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



export async function Add(req, res) {
    try {
  const {
            officerId,
            fullName,
            email,
            phone
        } = req.body;

        // Validation
        if (!officerId || !fullName || !email || !phone) {
          return res.status(400).json({ 
            success: false,
            message: "All fields (Officer ID, Full Name, Email, Phone) are required" 
          });
        }

        const emailExist = await SecurityOfficer.findOne({
             where: { email }
            });
            if (emailExist) {
            return res.status(400).json({ 
              success: false,
              message: "Email already exists" 
            });
            }
            const idExist = await SecurityOfficer.findOne({
             where: { officerId }
            });

            if (idExist) {
            return res.status(400).json({ 
              success: false,
              message: "Officer ID already exists" 
            });
            }

            // Generate a default password (can be changed later)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(officerId, salt);

                  const Officerdata = {
            officerId,
            fullName,
            email,
            phone,
            password: hashedPassword,
            isActive: true
        }

        const officer = await SecurityOfficer.create(Officerdata);

    return res.status(201).json({
            success: true,
            message: "Officer registered successfully",
            data: {
              officerId: officer.officerId,
              fullName: officer.fullName,
              email: officer.email,
              phone: officer.phone,
              isActive: officer.isActive
            }
        });
     
        
         
    } catch (error) {
        console.error("Error registering officer:", error);
        return res.status(500).json({ 
          success: false, 
          message: "Server error",
          error: error.message 
        });
    }
}

export async function GetAll(req, res) {
  try {
    const officers = await SecurityOfficer.findAll({
      attributes: { exclude: ["password"] }, 
      order: [["createdAt", "DESC"]],     
    });

    if (!officers || officers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No officers found",
      });
    }
    
    console.log(`Retrieved ${officers.length} officers`);

    return res.status(200).json({
      success: true,
      message: "Officers retrieved successfully",
      data: officers,
    });
  } catch (error) {
    console.error("Error fetching officers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export const getSingleOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;

    const officer = await SecurityOfficer.findOne({
      where: { officerId },
      attributes: { exclude: ["password"] }
    });

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Officer retrieved successfully",
      data: officer
    });
  } catch (error) {
    console.error("Error fetching officer:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const toggleOfficerStatus = async (req, res) => {
  try {
    const { officerId } = req.params;

    // Find the officer
    const officer = await SecurityOfficer.findOne({ where: { officerId } });
    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    // Toggle the status
    officer.isActive = !officer.isActive;
    await officer.save();

    return res.status(200).json({
      success: true,
      message: `Officer is now ${officer.isActive ? "active" : "inactive"}`,
      data: officer,
    });
  } catch (error) {
    console.error("Error toggling officer status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;
    const { fullName, email, phone } = req.body;

    // Validate input
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Full name, email, and phone are required' 
      });
    }

    const officer = await SecurityOfficer.findOne({ where: { officerId } });
    
    if (!officer) {
      return res.status(404).json({ 
        success: false,
        message: 'Officer not found' 
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== officer.email) {
      const existingOfficer = await SecurityOfficer.findOne({ where: { email } });
      if (existingOfficer) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
    }

    await officer.update({
      fullName,
      email,
      phone,
    });

    console.log(`Officer ${officerId} updated successfully`);

    // Remove password from response
    const updatedOfficer = officer.toJSON();
    delete updatedOfficer.password;

    res.json({
      success: true,
      message: 'Officer updated successfully',
      data: updatedOfficer,
    });
  } catch (error) {
    console.error("Error updating officer:", error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error updating officer' 
    });
  }
};

export const deleteOfficer = async (req, res) => {
  try {
    const { officerId } = req.params;

    const officer = await SecurityOfficer.findOne({ where: { officerId } });
    if (!officer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    await officer.destroy(); // Delete the record

    return res.status(200).json({
      success: true,
      message: "Officer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting officer:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeOfficer = async (req, res) => {
  const { officerId } = req.params;

try {
  const deleted = await SecurityOfficer.destroy({
      where: { officerId },
    });

    if (!deleted) {
      await t.rollback();
      return res.status(404).json({ message: "Officer not found" });
    }
res.json({ message: "Officer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
}
// Security Officer Login
export const securityLogin = async (req, res) => {
  try {
    const { email, officerId } = req.body;

    // Validation
    if (!email || !officerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and Officer ID are required" 
      });
    }

    // Find officer by email AND officerId
    const officer = await SecurityOfficer.findOne({ 
      where: { email, officerId } 
    });

    if (!officer) {
      console.log("Officer not found with email:", email, "and ID:", officerId);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or officer ID" 
      });
    }

    // Check if officer is active
    if (!officer.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is deactivated. Please contact administrator." 
      });
    }

    // Remove password from response
    const officerData = {
      officerId: officer.officerId,
      fullName: officer.fullName,
      email: officer.email,
      phone: officer.phone,
      isActive: officer.isActive,
      createdAt: officer.createdAt,
      updatedAt: officer.updatedAt
    };

    const token = jwt.sign(
      {
        officerId: officer.officerId,
        email: officer.email,
        role: "security_officer"
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log("Security officer logged in:", email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: officerData
    });

  } catch (error) {
    console.error("Security login error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
};

// Get Security Officer Profile
export const securityProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token is for security officer
      if (decoded.role !== 'security_officer') {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }

      const officer = await SecurityOfficer.findOne({ 
        where: { officerId: decoded.officerId },
        attributes: { exclude: ['password'] }
      });
      
      if (!officer) {
        return res.status(404).json({ 
          success: false, 
          message: "Officer not found" 
        });
      }

      return res.status(200).json({
        success: true,
        data: officer
      });

    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

  } catch (error) {
    console.error("Security profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    // Use req.user which was set by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "No authorization token provided" 
      });
    }

    const decoded = req.user;
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Current password and new password are required" 
      });
    }

    // Validate password length - minimum 6 characters
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 6 characters long" 
      });
    }

    // Find officer by ID from token
    const officer = await SecurityOfficer.findOne({
      where: { officerId: decoded.officerId }
    });
    
    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: "Officer not found" 
      });
    }

    console.log("Password change attempt for officer:", officer.officerId);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, officer.password);
   
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Current password is incorrect" 
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, officer.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be different from current password" 
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    officer.password = hashedPassword;
    await officer.save();

    return res.status(200).json({ 
      success: true, 
      message: "Password changed successfully" 
    });
    
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};;

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const {token} = req.headers;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No authorization token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { fullName, phone, officerId } = req.body;

    // Find officer by ID from token (current officer)
    const officer = await SecurityOfficer.findOne({ 
      where: { officerId: decoded.officerId }
    });
    
    if (!officer) {
      return res.status(404).json({ 
        success: false, 
        message: "Officer not found" 
      });
    }

    // Check if new officer ID already exists (if changing it)
    if (officerId && officerId !== officer.officerId) {
      const existingOfficer = await SecurityOfficer.findOne({
        where: { officerId }
      });
      
      if (existingOfficer) {
        return res.status(400).json({
          success: false,
          message: "Officer ID already exists"
        });
      }
    }

    // Update fields
    if (fullName !== undefined) officer.fullName = fullName;
    if (phone !== undefined) officer.phone = phone;
    if (officerId !== undefined && officerId !== officer.officerId) officer.officerId = officerId;
    
    await officer.save();

    // Remove password from response
    const officerResponse = {
      officerId: officer.officerId,
      fullName: officer.fullName,
      email: officer.email,
      phone: officer.phone,
      isActive: officer.isActive,
      createdAt: officer.createdAt,
      updatedAt: officer.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: officerResponse
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};;

