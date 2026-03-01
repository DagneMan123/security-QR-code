import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SecurityContext } from "../context/SecurityContext";
import { Link } from "react-router-dom";
import QRScanner from "../components/QRScanner";


const SecurityDashboard = () => {
  const { devices, stats, verifyQRCode, logout, backendUrl, navigate } = useContext(SecurityContext);

  const [scanMode, setScanMode] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");



  const handleQrResult = async (result, error) => {
   
    if (result) {
      const qrData  = result?.text ?? result;
      
      setScanResult(qrData );
    console.log(qrData);

      setScanMode(false);

   try {
      const response = await axios.post(backendUrl + "/api/devices/decrypt", {
        qrData
      }); 

    const decryptedData = response.data.data; // { ownerId, serialNumber }
    console.log(decryptedData.ownerId);
   

    const deviceRes = await axios.get(`${backendUrl}/api/devices/by-owner/${decryptedData.ownerId}`);
      const device = deviceRes.data.device;

    console.log(device);
    console.log(device.deviceId);

      if (!device) {
        console.log("no device");
        
      setScanError("No device found for this student.");
      return;
    }

      navigate(`/security/device/${device.deviceId}`)

   } catch (err) {
      console.error("Failed to decrypt QR:", err);
      setScanError("Failed to decode QR. Make sure it is a valid device QR.");
    }

  }

  if (error && error.name !== "NotFoundException") {
    console.error("QR error:", error);
    setScanError("Camera error: " + (error.message || error.name));
  }
  };

  // Auto-refresh token on activity
  useEffect(() => {
    const refreshTokenTimestamp = () => {
      const timestamp = localStorage.getItem("security_token_timestamp");
      if (timestamp) {
        localStorage.setItem("security_token_timestamp", Date.now().toString());
      }
    };

    // Refresh on component mount
    refreshTokenTimestamp();

    // Refresh on user activity
    const events = ['click', 'keypress', 'scroll', 'mousemove'];
    const refreshOnActivity = () => refreshTokenTimestamp();
    
    events.forEach(event => {
      window.addEventListener(event, refreshOnActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, refreshOnActivity);
      });
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header - Same as admin but with security title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor device and student activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Security Active • Real-time</span>
        </div>
      </div>

      {/* QR Scan Result */}
      {scanResult && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Scan Result</h3>
            <button
              onClick={() => setScanResult(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Device ID</p>
              <p className="font-semibold text-gray-900 dark:text-white">{scanResult.deviceId}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
              <p className="font-semibold text-gray-900 dark:text-white">{scanResult.studentName || scanResult.ownerName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {scanResult.ownerId}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                scanResult.status === "login" && !scanResult.isBlocked
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : scanResult.isBlocked
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
                {scanResult.isBlocked ? "Blocked" : scanResult.status === "login" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <Link
              to={`/security/device/${scanResult.deviceId}`}
              className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              View Device Details
            </Link>
          </div>
        </div>
      )}

      {/* Scan Error */}
      {scanError && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800 dark:text-red-300">{scanError}</span>
          </div>
        </div>
      )}

      {/* Stats Grid - Same as admin but with security routes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon="device"
          color="blue"
          link="/security/list-device"
          trend="All Devices"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="user"
          color="emerald"
          link="/security/manage-students"
          trend="Registered"
        />
        <StatCard
          title="Logins Today"
          value={stats.loginsToday}
          icon="login"
          color="green"
          link="/security/today-logins"
          trend="Active"
        />
        <StatCard
          title="Logouts Today"
          value={stats.logoutsToday}
          icon="logout"
          color="amber"
          link="/security/today-logouts"
          trend="Today"
        />
        <StatCard
          title="Blocked Devices"
          value={stats.blockedDevices}
          icon="shield"
          color="red"
          link="/security/blocked-devices"
          trend="Restricted"
        />
        <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          icon="activity"
          color="cyan"
          link="/security/list-device"
          trend="Currently Active"
        />
      </div>


      {/* Recent Activity - Same as admin but with security routes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity Log</h2>
          <Link
            to="/security/today-logins"
            className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center"
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Device/User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {stats.recentActivity.slice(0, 5).map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{log.time}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Today</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      log.status === "Login"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {log.status === "login" ? (
                        <>
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Login
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Logout
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{log.deviceId}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{log.user || "Student Device"}</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">QR Code Scanner</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Scan device QR codes to verify access</p>
          </div>
          <button
            onClick={() => setScanMode(!scanMode)}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {scanMode ? "Close Scanner" : "Open Scanner"}
          </button>
        </div>
        
        {scanMode && (
          <div>
            <div className="max-w-sm mx-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700  shadow-lg">
            <QRScanner onScan={handleQrResult} onError={(err) => setScanError(err.message)} />
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Security Instructions</h3>
              <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Scan device QR codes to verify student access</li>
                <li>• Monitor device status in real-time</li>
                <li>• Block unauthorized devices immediately</li>
                <li>• Track login/logout activity patterns</li>
              </ul>
            </div>
          </div>
        </div>
          </div>
        )}
        
        
      </div>
    </div>
  );
};

// Stat Card Component - Same as admin
const StatCard = ({ title, value, icon, color, link, trend }) => {
  const iconColors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  };

  const icons = {
    device: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    user: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21" />
      </svg>
    ),
    login: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    logout: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    shield: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    activity: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  };

  return (
    <Link to={link} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 hover:border-cyan-200 dark:hover:border-cyan-800">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconColors[color]}`}>
            {icons[icon]}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend.includes("+")
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              : trend.includes("-")
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          }`}>
            {trend}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{title}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center">
            View details
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SecurityDashboard;