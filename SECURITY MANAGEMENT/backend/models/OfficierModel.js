import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SecurityOfficer = sequelize.define(
  "SecurityOfficer",
  {
    officerId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("SECURITY"),
      defaultValue: "SECURITY",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "security_officers",
    timestamps: true,
  }
);

export default SecurityOfficer;