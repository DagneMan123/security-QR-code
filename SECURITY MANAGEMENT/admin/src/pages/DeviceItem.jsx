import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {AdminContext} from "../context/AdminContext"
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import { toast } from "react-toastify";

const DeviceDetails = () => {
  const { deviceId } = useParams(); 
  const { devices, navigate, backendUrl, setDevices, fetchStats, getDeviceData, token } = useContext(AdminContext)
  const [device, setDevice] = useState(null);

  const [ image, setImage]= useState('')
  const [ qr, setQr]= useState('')
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [form, setForm] = useState({
    deviceId: "",
    ownerId: "",
    ownerName: "",
    serialNumber: "",
    pcType: "",
    status: "",
    phone: "",
    email: "",
    department:""
  });


  const handleBlockToggle = async (deviceId, isBlocked) => {
  if (!token) {
    toast.error("Authentication token not found. Please login again.");
    return;
  }

  try {
    console.log("Toggling block status for device:", deviceId, "to:", isBlocked);
    const res = await axios.patch(
      `${backendUrl}/api/devices/update/${deviceId}/block`,
      { isBlocked },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDevices(prev =>
      prev.map(d =>
        d.deviceId === deviceId ? { ...d, isBlocked } : d
      )
    );
    setDevice(prev => prev ? { ...prev, isBlocked } : null);
    await fetchStats();

    toast.success(res.data.message || (isBlocked ? "Device blocked successfully" : "Device unblocked successfully"));
  } catch (error) {
    console.error("Block toggle error:", error);
    toast.error(error.response?.data?.message || "Failed to update block status");
  }
};


  useEffect(() => {
    const fetchData = devices.find(d => d.deviceId === deviceId);

    if (fetchData) {
      setDevice(fetchData);
      setForm({
        deviceId: fetchData.deviceId,
        ownerId: fetchData.ownerId,
        ownerName: fetchData.Student.fullName,
        serialNumber: fetchData.serialNumber,
        pcType: fetchData.deviceType,
        status: fetchData.status,
        department: fetchData.Student.department || "",
        phone: fetchData.Student.phone || "",
        email: fetchData.Student.email || "",
      });
      setImage(fetchData.Student?.imageUrl);
      setQr(fetchData.qrEncrypted)
    }
    
  }, [deviceId, devices]);


  // console.log(qr);
  
const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this device and student?")) {
    return;
  }

  if (!token) {
    toast.error("Authentication token not found. Please login again.");
    return;
  }

   try {
    console.log("Deleting device:", deviceId);
    await axios.delete(`${backendUrl}/api/devices/${deviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Device deleted successfully");

    // go back to devices list
    navigate("/manage-students");
    setDevices(prev =>
      prev.filter(d => d.deviceId !== deviceId)
    );
    await fetchStats();


  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.response?.data?.message || "Failed to delete device");
  }
  }
  
    

const downloadQR = async () => {
  if (!qr) {
        setError("Nothing to download: QR value is empty."); return;

  }

  try {
    // generate PNG data URL with good resolution
    const pngUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
    console.log("dd");

    
    const link = document.createElement("a");
    link.href = pngUrl;
    console.log("dd");
    
    link.download = `${deviceId || "device"}_qr.png`;
    link.click();
  } catch (err) {
    console.error("Failed to generate QR PNG:", err);
    // setError("Failed to generate QR for download.");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!token) {
    toast.error("Authentication token not found. Please login again.");
    return;
  }

  try {
    const res = await axios.put(
      `${backendUrl}/api/devices/update/${form.deviceId}`,
      {
        deviceId: form.deviceId,
        ownerId: form.ownerId,
        ownerName: form.ownerName,
        serialNumber: form.serialNumber,
        pcType: form.pcType,
        status: form.status,
        phone: form.phone,
        department: form.department,
        email: form.email,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Update device in context
    setDevices((prev) =>
      prev.map((d) =>
        d.deviceId === form.deviceId
          ? {
              ...d,
              ownerId: form.ownerId,
              serialNumber: form.serialNumber,
              deviceType: form.pcType,
              status: form.status,
              Student: { 
                ...d.Student, 
                phone: form.phone, 
                email: form.email, 
                fullName: form.ownerName,
                department: form.department,
                updatedAt: new Date().toISOString(), 
              },
            }
          : d
      )
    );

    // Also update the local device state
    setDevice(prev => prev ? {
      ...prev,
      ownerId: form.ownerId,
      serialNumber: form.serialNumber,
      deviceType: form.pcType,
      status: form.status,
      Student: {
        ...prev.Student,
        phone: form.phone,
        email: form.email,
        fullName: form.ownerName,
        department: form.department,
      }
    } : prev);

    await getDeviceData();
    await fetchStats();

    toast.success(res.data.message || "Device updated successfully");
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error.response?.data?.message || "Update failed");
  }
};


  // if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!device) return <p className="text-center mt-10">Device not found</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Device Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage device information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Device
          </button>
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
                Active
              </span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-center">
              <QRCodeSVG id="device-qr-svg" value={qr} size={200} />
            </div>
            <button
              onClick={downloadQR}
              className="w-full mt-4 inline-flex items-center justify-center px-4 py-3 bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>
        </div>

        {/* Right Column - Device Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {device && !device.isBlocked ? (
                <button
                  onClick={() => handleBlockToggle(device.deviceId, true)}
                  className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Block Device
                </button>
              ) : (
                <button
                  onClick={() => handleBlockToggle(device.deviceId, false)}
                  className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Unblock Device
                </button>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Device
              </button>
            </div>

            {/* Device Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditDeviceModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        form={form}
        onChange={handleChange}
        onSubmit={async (e) => {
          await handleSubmit(e);
          setIsEditOpen(false);
        }}
      />
    </div>
  );
};

// Info Card Component
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
            {value === "login" ? "Active" : "Inactive"}
          </span>
        )}
      </div>
      <div className="text-gray-900 dark:text-white font-medium truncate">{value || "N/A"}</div>
    </div>
  );
};

const EditDeviceModal = ({ open, onClose, form, onChange, onSubmit }) => {
  if (!open) return null;

  // Local onChange handlers
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '').slice(0, 10);
    onChange({ target: { name: 'phone', value: cleanedValue } });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    const formattedValue = cleanedValue.replace(/\b\w/g, char => char.toUpperCase());
    onChange({ target: { name: 'ownerName', value: formattedValue } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Device Details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update device information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Device ID <span className="text-red-500">*</span>
              </label>
              <input
                name="deviceId"
                value={form.deviceId}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Owner ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner ID <span className="text-red-500">*</span>
              </label>
              <input
                name="ownerId"
                value={form.ownerId}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Owner Name - Alphabets only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleNameChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                maxLength={50}
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                name="serialNumber"
                value={form.serialNumber}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Phone - Numbers only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                type="tel"
                maxLength={10}
                placeholder="0912345678"
              />
            </div>

            {/* PC Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                PC Type <span className="text-red-500">*</span>
              </label>
              <select
                name="pcType"
                value={form.pcType}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              >
                <option value="">Select Type</option>
                <option value="HP">HP</option>
                <option value="acer">Acer</option>
                <option value="lenovo">Lenovo</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              >
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>

            {/* Department */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              >
                <option value="">Select Department</option>
                <option value="Software">Software</option>
                <option value="Computer">Computer Science</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechatronics">Mechatronics</option>
                <option value="Civil">Civil</option>
                <option value="Textile">Textile</option>
                <option value="Water">Water</option>
                <option value="Garment">Garment</option>
                <option value="Hydrolics">Hydrolics</option>
                <option value="Cotem">Cotem</option>
                <option value="Chemical">Chemical</option>
                <option value="Industrial">Industrial</option>
                <option value="Leather">Leather</option>
                <option value="Fashion">Fashion</option>
                <option value="Architecture">Architecture</option>
                <option value="Biomedical">Biomedical</option>
                <option value="IS">IS</option>
                <option value="IT">IT</option>
                <option value="Food">Food</option>
              </select>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                type="email"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceDetails;
