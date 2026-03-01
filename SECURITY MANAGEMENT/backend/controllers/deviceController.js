import { Student, Device, sequelize } from "../models/index.js";
import { Op } from "sequelize";
import { encrypt, decrypt } from "../utils/crypto.js";
import bcrypt from "bcrypt"


export async function registerDevice(req, res) {
    try {

        const image = req.file;
        const {
            deviceId,
            ownerId,
            studentName,
            studentEmail,
            pcType,
            serialNumber,
            depatrment,
            phone
        } = req.body;

        if (!image) return res.status(400).json({ success: false, message: "Owner photo is required" });

        const qrPayload = JSON.stringify({
            ownerId,
            serialNumber,
        });
        const encryptedQR = encrypt(qrPayload);

        const deviceData = {
            deviceId,
            ownerId,
            ownerName: studentName,
            deviceType: pcType,
            serialNumber,
            qrEncrypted: encryptedQR,
        };

        const emailExist = await Student.findOne({
             where: { email: studentEmail }
            });
            if (emailExist) {
            return res.status(400).json({ message: "Email already exists" });
            }

            const ownerExist = await Student.findOne({
             where: { studentId: ownerId, }
            });

            if (ownerExist) {
             return res.status(400).json({ message: "Owner ID already exists" });
            }

            const deviceExist = await Student.findOne({
             where: { deviceId }
            });

            if (deviceExist) {
             return res.status(400).json({ message: "Device ID already exists" });
            }

            // check serial number
            const serialExist = await Device.findOne({
             where: { serialNumber }
            });

            if (serialExist) {
              return res.status(400).json({ message: "device Serial number already exists" });
            }

        // Use Cloudinary URL from multer-storage-cloudinary
        const imageUrl = image.path || `data:${image.mimetype};base64,${image.buffer.toString("base64")}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(deviceId, salt);

        const Studentdata = {
            studentId: ownerId,
            imageUrl: imageUrl,
            fullName: studentName,
            email: studentEmail,
            deviceId,
            phone,
            department: depatrment,
            password: hashedPassword
        }



    
           const device = await Device.create(deviceData);
        // console.log("66");


        const student = await Student.create(Studentdata);
        //  console.log(device);
          
        return res.status(201).json({
            success: true,
            message: "Device registered successfully",
            data: device
        });
     
        
         
    } catch (error) {
        console.error("Error registering device:", error);
        return res.status(500).json({ success: false, messsage: "Server error" });
    }
}

export async function decryptQR(req, res) {
    const { qrData } = req.body;
    try {
        const decrypted = decrypt(qrData);
        console.log("decreapted");
        
        res.json({ data: JSON.parse(decrypted) });
    } catch {
        res.status(400).json({ message: "Invalid QR" });
    }
}

export async function getAllDevices(req, lres) {
    const devices = await Device.findAll();
    res.json(devices);
}



export const getDeviceByOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const device = await Device.findOne({ where: { ownerId } });
    console.log(ownerId);
     
    // if (device.isBlocked) return res.status(404).json({ message: "Device is blocked" });

    if (!device) return res.status(404).json({ message: "Device not found" });

    res.json({ device });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export async function listDevice(req, res) {



    
    try {
    const devices = await Device.findAll({
      include: [
        {
          model: Student
          // no attributes: [...] so it returns all columns
        }
      ],
      order: [["createdAt", "DESC"]],        // latest first
    });




//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const todayDevices = await Device.findAll({
//   where: {
//     loginAt: {
//       [Op.between]: [startOfDay, endOfDay]
//     }
//   },
//   order: [["loginAt", "DESC"]]
// });


    return res.json({
            success: true,
            devices,
            // todayDevices
        });

} catch (error) {
   console.error("Error in controller:", error);
  return res.status(500).json({
    success: false,
    message: "Failed to fetch devices",
    error: error.message
  });
    

}


}
export async function removeDevice(req, res) {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ 
      success: false,
      message: "Device ID is required" 
    });
  }

  const t = await sequelize.transaction();

  try {
    // Check if device exists first
    const device = await Device.findOne({
      where: { deviceId },
      transaction: t
    });

    if (!device) {
      await t.rollback();
      return res.status(404).json({ 
        success: false,
        message: "Device not found" 
      });
    }

    // Delete students associated with this device
    await Student.destroy({
      where: { deviceId },
      transaction: t
    });

    // Then delete device
    const deleted = await Device.destroy({
      where: { deviceId },
      transaction: t
    });

    if (!deleted) {
      await t.rollback();
      return res.status(404).json({ 
        success: false,
        message: "Failed to delete device" 
      });
    }

    await t.commit();

    console.log("Device deleted successfully:", deviceId);

    res.json({ 
      success: true,
      message: "Device and associated students deleted successfully" 
    });

  } catch (err) {
    await t.rollback();
    console.error("Error deleting device:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete device",
      error: err.message 
    });
  }
}
export async function singleDevice(req, res) {

 
    try {
      const {deviceId} = req.body;
      if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: "deviceId is required"
            });

        }
        const device = await Device.findOne({
            where: { deviceId },
            include: [
                {
                    model: Student,
                    required: false    // no student? still return device
                }
            ]
        });

         if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        const responseObject = {
            deviceId: device.deviceId,
            ownerId: device.ownerId,
            ownerName: device.ownerName,
            deviceType: device.deviceType,
            serialNumber: device.serialNumber,
            qrEncrypted: device.qrEncrypted,
            student: device.Student ? {
                studentId: device.Student.studentId,
                fullName: device.Student.fullName,
                email: device.Student.email,
                department: device.Student.department,
                imageUrl: device.Student.imageUrl   // base64 image stored
            } : null
        };

        return res.status(200).json({
            success: true,
            message: "Device details retrieved",
            data: responseObject
        });


    } catch (error) {
        console.error("Error getting device:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
    
   

}
export async function updateDeviceStatus(req, res) {
  const { deviceId } = req.params;
  const { status } = req.body;

  if (!deviceId) {
    return res.status(400).json({ 
      success: false,
      message: "Device ID is required" 
    });
  }

  if (!status || !["login", "logout"].includes(status)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid status value. Must be 'login' or 'logout'" 
    });
  }

  try {
    // First, find the device
    const device = await Device.findOne({
      where: { deviceId }
    });

    if (!device) {
      return res.status(404).json({ 
        success: false,
        message: "Device not found" 
      });
    }

    // Update the device status
    device.status = status;
    
    // Also update isLoggedOut flag based on status
    if (status === "logout") {
      device.isLoggedOut = true;
    } else if (status === "login") {
      device.isLoggedOut = false;
    }
    
    const updatedDevice = await device.save();

    console.log("Status updated for device:", deviceId, "to:", status);

    res.json({
      success: true,
      message: "Status updated successfully",
      device: updatedDevice
    });

  } catch (error) {
    console.error("Error updating device status:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update status",
      error: error.message 
    });
  }
}

export const toggleBlockDevice = async (req, res) => {
  const { deviceId } = req.params;
  const { isBlocked } = req.body;

  if (!deviceId) {
    return res.status(400).json({ 
      success: false,
      message: "Device ID is required" 
    });
  }

  if (typeof isBlocked !== 'boolean') {
    return res.status(400).json({ 
      success: false,
      message: "isBlocked must be a boolean value" 
    });
  }

  try {
    const device = await Device.findOne({ where: { deviceId } });

    if (!device) {
      return res.status(404).json({ 
        success: false,
        message: "Device not found" 
      });
    }

    device.isBlocked = isBlocked;
    const updatedDevice = await device.save();

    console.log("Device block status updated:", deviceId, "to:", isBlocked);

    res.status(200).json({
      success: true,
      message: isBlocked ? "Device blocked successfully" : "Device unblocked successfully",
      device: updatedDevice
    });

  } catch (error) {
    console.error("Error updating block status:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update block status",
      error: error.message 
    });
  }
}
export const BlockDevice = async (req, res) => {
  const { deviceId } = req.params;

  try {
    
    const device = await Device.findOne({ where: {deviceId}})

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    device.isBlocked = true;
    await device.save();

    res.status(200).json({
      message: "Device blocked",
      device,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateInfo = async (req, res) => {

  const {
    deviceId,
    ownerId,
    ownerName,
    serialNumber,
    pcType,
    status,
    phone,
    email,
    department
  } = req.body;
  console.log(req.body);

   const qrPayload = JSON.stringify({
            ownerId,
            serialNumber,
        });
        const encryptedQR = encrypt(qrPayload);

  

  try {
    await Device.update(
      {
        ownerId,
        ownerName,
        serialNumber,
        deviceType: pcType,
        status,
        qrEncrypted: encryptedQR
      },
      { where: { deviceId } }
    );
    console.log("device updated");
    

    await Student.update(
      { phone, 
        email, 
        fullName: ownerName,
        department
       },
      { where: { deviceId } }
    );
    console.log("on Updating");
    

    res.json({ message: "Device updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const todayInfo = async (req, res) => {
   try {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const loginsToday = await Device.findAll({
      where: {
        status: "login",
        updatedAt: { [Op.between]: [startOfDay, endOfDay] }
      }
    });

     const logoutsToday = await Device.findAll({
      where: {
        status: "logout",
        updatedAt: { [Op.between]: [startOfDay, endOfDay] }
      }
    });


     res.json({
            success: true,
            data: {
                loginsToday,
                logoutsToday, 
              }
          });
   } catch (error) {
    console.error("Error in feaching Today Data", error);
    res.status(500).json({ message: "Error in feaching Today Data" });
   }
}


export const blockInfo = async (req, res) => {
  try {
    const blockedDevices = await Device.findAll({ 
      where: { isBlocked: true },
      order: [["updatedAt", "DESC"]]
    });

    console.log("Fetching blocked devices:", blockedDevices.length);

    res.json({
      success: true,
      data: blockedDevices
    });

  } catch (error) {
    console.error("Error fetching blocked data:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching blocked data",
      error: error.message 
    });
  }
};


// Set multiple devices as blocked
export const setDevicesBlocked = async (req, res) => {
  try {
    const { deviceIds } = req.body;

    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "deviceIds array is required"
      });
    }

    const updated = await Device.update(
      { isBlocked: true },
      { where: { deviceId: deviceIds } }
    );

    console.log("Devices set as blocked:", updated);

    res.json({
      success: true,
      message: `${updated[0]} devices set as blocked`,
      count: updated[0]
    });

  } catch (error) {
    console.error("Error setting devices as blocked:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set devices as blocked",
      error: error.message
    });
  }
}

export const setAllDevicesLogout = async (req, res) => {
  try {
    const updated = await Device.update(
      { 
        status: "logout",
        isLoggedOut: true
      },
      { where: {} }
    );

    console.log("All devices set to logout:", updated[0]);

    res.json({
      success: true,
      message: `${updated[0]} devices set to logout status`,
      count: updated[0]
    });

  } catch (error) {
    console.error("Error setting all devices to logout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set devices to logout",
      error: error.message
    });
  }
}

export const setAllDevicesActive = async (req, res) => {
  try {
    const updated = await Device.update(
      { 
        status: "login",
        isLoggedOut: false
      },
      { where: {} }
    );

    console.log("All devices set to active:", updated[0]);

    res.json({
      success: true,
      message: `${updated[0]} devices set to active status`,
      count: updated[0]
    });

  } catch (error) {
    console.error("Error setting all devices to active:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set devices to active",
      error: error.message
    });
  }
}

export const setAllDevicesInactive = async (req, res) => {
  try {
    const updated = await Device.update(
      { 
        status: "logout",
        isLoggedOut: true
      },
      { where: {} }
    );

    console.log("All devices set to inactive:", updated[0]);

    res.json({
      success: true,
      message: `${updated[0]} devices set to inactive status`,
      count: updated[0]
    });

  } catch (error) {
    console.error("Error setting all devices to inactive:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set devices to inactive",
      error: error.message
    });
  }
};
