import sequelize from "../config/db.js";
import Student from "./StudentModel.js";
import Device from "./Devicemodel.js";
import SecurityOfficer from "./OfficierModel.js";


await sequelize.sync({ alter: true })
Device.hasOne(Student, {
  foreignKey: "deviceId",
  sourceKey: "deviceId"
});

Student.belongsTo(Device, {
  foreignKey: "deviceId",
  targetKey: "deviceId"
});

export { Student, Device, SecurityOfficer, sequelize };