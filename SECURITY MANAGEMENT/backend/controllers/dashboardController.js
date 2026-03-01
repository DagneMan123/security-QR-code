import { Device, Student,} from "../models/index.js";
import { Op, fn, col, literal } from "sequelize";

export const getDashboardStats = async (req, res) => {

  try {
    // ---------- BASIC COUNTS ----------
   const [
      totalDevices,
      totalStudents,
      blockedDevices,
    ] = await Promise.all([
      Device.count(),
      Student.count(),
      Device.count({ where: { isBlocked: true } }),
    ]);
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

const activeDevices = await Device.count({
      where: {
        status: "login",
        isBlocked: false
      }
    });


        const loginsToday = await Device.count({
      where: {
        status: "login",
        updatedAt: { [Op.between]: [startOfDay, endOfDay] }
      }
    });

     const logoutsToday = await Device.count({
      where: {
        status: "logout",
        updatedAt: { [Op.between]: [startOfDay, endOfDay] }
      }
    });

    const recentActivityRaw = await Device.findAll({
      order: [["createdAt", "DESC"]],
      limit: 8
    });

    const recentActivity = recentActivityRaw.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(log => ({
      time: log.updatedAt.toLocaleTimeString(),
      status: log.status,
      deviceId: log.deviceId, 
    }));

    const today = new Date();
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return d;
    }).reverse();

    const labels = last7Days.map(d => d.toISOString().slice(0, 10));

    const loginsData = await Promise.all(
      last7Days.map(d => 
        Device.count({
          where: { 
            status: "login",
            updatedAt: { [Op.between]: [new Date(d.setHours(0,0,0,0)), new Date(d.setHours(23,59,59,999))] }
          }
        })
      )
    );

    const logoutsData = await Promise.all(
      last7Days.map(d => 
        Device.count({
          where: { 
            status: "logout",
            updatedAt: { [Op.between]: [new Date(d.setHours(0,0,0,0)), new Date(d.setHours(23,59,59,999))] }
          }
        })
      )
    );
    



      res.json({
            success: true,
            data: {
                totalDevices,
                totalStudents,
                blockedDevices,
                activeDevices,
                loginsToday,
                logoutsToday, 
                recentActivity,
                labels, 
                loginsData, 
                logoutsData
              }
          });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
