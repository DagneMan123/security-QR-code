import sequelize from "../config/db.js";
import Student from "./StudentModel.js";
import Device from "./Devicemodel.js";
import SecurityOfficer from "./OfficierModel.js";

try {
  await sequelize.sync({ alter: true });
  console.log("✅ Database synced successfully.");
} catch (error) {
  console.error("❌ Database sync failed:", error.message);
}

Device.hasOne(Student, {
  foreignKey: "deviceId",
  sourceKey: "deviceId"
});

Student.belongsTo(Device, {
  foreignKey: "deviceId",
  targetKey: "deviceId"
});

export { Student, Device, SecurityOfficer, sequelize };
