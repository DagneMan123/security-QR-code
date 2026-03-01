import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SecurityContext } from "../context/SecurityContext";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";

const SecurityDeviceDetails = () => {
  const { deviceId } = useParams(); 
  const { devices, navigate, backendUrl, handleBlockDevice, updateDeviceStatus } = useContext(SecurityContext)
  const [device, setDevice] = useState(null);
  const [image, setImage] = useState('')
  const [qr, setQr] = useState('')

  useEffect(() => {
    const fetchData = devices.find(d => d.deviceId === deviceId);
    if (fetchData) {
      setDevice(fetchData);
      setImage(fetchData.Student?.imageUrl);
      setQr(fetchData.qrEncrypted)
    }
  }, [deviceId, devices]);

  if (!device) return <p className="text-center mt-10">Device not found</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Device Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View device information and manage access</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="space-y-6">
          {/* Owner Photo Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Owner Photo</h3>
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                Verified
              </span>
            </div>
            <div className="relative">
              <img
                className="w-full h-64 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                src={image || "https://via.placeholder.com/400x300/1e293b/94a3b8?text=No+Image"}
                alt="Owner"
              />
              <div className="absolute inset-0 bg-gralineardient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Device QR Code</h3>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                Scan to Verify
              </span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-center">
              <QRCodeSVG id="device-qr-svg" value={qr} size={200} />
            </div>
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Scan this QR code to verify device authenticity
            </div>
          </div>
        </div>

        {/* Right Column - Device Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {!device.isBlocked ? (
                <>
                  <button
                    onClick={() => updateDeviceStatus(device.deviceId, "login")}
                    disabled={device.status === "login"}
                    className={`inline-flex items-center px-4 py-2.5 rounded-xl hover:shadow-lg transition-all ${
                      device.status === "login"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/25"
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Set as Login
                  </button>
                  <button
                    onClick={() => updateDeviceStatus(device.deviceId, "logout")}
                    disabled={device.status === "logout"}
                    className={`inline-flex items-center px-4 py-2.5 rounded-xl hover:shadow-lg transition-all ${
                      device.status === "logout"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-amber-500 to-orange-600 text-white hover:shadow-amber-500/25"
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Set as Logout
                  </button>
                  <button
                    onClick={() => handleBlockDevice(device.deviceId)}
                    className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Block Device
                  </button>
                </>
              ) : (
                <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-800 dark:text-red-300">This device is blocked. Contact admin to unblock.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Device Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Device Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard label="Device ID" value={device?.deviceId} icon="id" />
                <InfoCard label="Owner ID" value={device?.ownerId} icon="user" />
                <InfoCard label="Owner Name" value={device?.ownerName} icon="name" />
                <InfoCard label="Serial Number" value={device?.serialNumber} icon="serial" />
                <InfoCard label="PC Type" value={device?.deviceType} icon="device" />
                <InfoCard
                  label="Status"
                  value={device?.status}
                  icon="status"
                  badge={device?.status === "login" ? "success" : "warning"}
                />
                <InfoCard label="Phone" value={device?.Student?.phone} icon="phone" />
                <InfoCard label="Email" value={device?.Student?.email} icon="email" />
                <InfoCard label="Department" value={device?.Student?.department} icon="department" />
              </div>
            </div>

            {/* Registration Metadata */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Registration Metadata
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="Created At"
                  value={device ? new Date(device.createdAt).toLocaleString() : ""}
                  icon="calendar"
                />
                <InfoCard
                  label="Last Updated"
                  value={device ? new Date(device.updatedAt).toLocaleString() : ""}
                  icon="update"
                />
                <InfoCard
                  label="Block Status"
                  value={device?.isBlocked ? "Blocked" : "Active"}
                  icon="blocked"
                  badge={device?.isBlocked ? "danger" : "success"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info Card Component (same as in DeviceItem.jsx but with security context)
const InfoCard = ({ label, value, icon, badge }) => {
  const icons = {
    id: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    name: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    serial: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    device: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    status: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    phone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    department: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    update: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    blocked: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  const badgeStyles = {
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-3">
            {icons[icon] || icons.id}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStyles[badge]}`}>
            {value === "login" ? "Active" : value === "blocked" ? "Blocked" : "Inactive"}
          </span>
        )}
      </div>
      <div className="text-gray-900 dark:text-white font-medium truncate">{value || "N/A"}</div>
    </div>
  );
};

export default SecurityDeviceDetails;