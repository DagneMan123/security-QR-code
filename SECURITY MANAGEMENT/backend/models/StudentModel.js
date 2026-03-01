import { DataTypes, } from "sequelize";

import sequelize from "../config/db.js"


const Student = sequelize.define('Student', {

  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.TEXT,
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
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    foreignKey: true,
  },
  phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  password: {
  type: DataTypes.STRING,
  allowNull: false,
},
  department: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'students', // optional: set explicit table name
  timestamps: true, // createdAt/updatedAt auto
});



export default Student;


