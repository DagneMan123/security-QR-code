import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Device = sequelize.define("Device", {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
  },
    ownerName: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    serialNumber: {
        type:DataTypes.STRING,
        allowNull: false, 
        unique: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "login"
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isLoggedOut: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
    qrEncrypted: DataTypes.TEXT
    }, {
  timestamps: true
});

export default Device;