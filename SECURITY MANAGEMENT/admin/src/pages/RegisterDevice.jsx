import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import QRScanner from "../components/QRScanner";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";




export default function RegisterDevice({ onRegistered }) {


  const [image, setImage]= useState("");


  const emptyForm = {
  ownerPhoto: image,
  deviceId: "",
  ownerId: "",
  studentName: "",
  studentEmail:"",
  depatrment:"",
  pcType: "",
  serialNumber: "",
  phone:""
};


const {navigate, token, setToken, getDeviceData, fetchStats} = useContext(AdminContext)

  const [form, setForm] = useState(emptyForm);
  const [scanMode, setScanMode] = useState(false);
  const [scannedValue, setScannedValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // small helper to generate fallback deviceId
  const genDeviceId = () =>
    `DEV-${Date.now().toString(36).toUpperCase().slice(-8)}`;
 const handleScan = (text) => {
    setScannedValue(text);
    setScanMode(false); // stop scanning automatically
  };



  const handleError = (error) => {
    
  };

  useEffect(() => {
   
    
    if (!form.deviceId) {
      setForm((f) => ({ ...f, deviceId: genDeviceId() }));
    }
    
  }, []);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
   
  };

 
  // submit to backend
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccessMsg("");

    // console.log(form.phone);

    // if (!form.im.trim()) return setError("Owner Photo is required.");
    if (!form.deviceId.trim()) return setError("Device ID is required.");
    if (!form.ownerId.trim()) return setError("Owner Student ID is required.");
    if (!form.studentName.trim()) return setError("Owner Student Name is required.");
    if (!form.studentEmail.trim()) return setError("Email Address is required.");
    if (!form.pcType.trim()) return setError("Pc Type is required.");
    if (!form.serialNumber.trim()) return setError("Serial Number is required.");
    if (!form.depatrment.trim()) return setError("Department is required.");
    if (!form.phone.trim()) return setError("Phone Number is required.");
  

    try {


      const formData = new FormData();
             formData.append("ownerPhoto", image);  
             formData.append("deviceId", form.deviceId);
             formData.append("ownerId", form.ownerId);
             formData.append("studentName", form.studentName);
             formData.append("studentEmail", form.studentEmail);
             formData.append("depatrment", form.depatrment);
             formData.append("pcType", form.pcType);
             formData.append("serialNumber", form.serialNumber);
             formData.append("phone", form.phone);


             const newForm = {
              ownerId: form.ownerId,
              serialNumber: form.serialNumber,
            };                  

            formData.append("qrData", JSON.stringify(newForm));



            
    const response = await axios.post(`${backendUrl}/api/devices/add`,formData,
  {headers:{token}}
);

  if(response.data.success) {
     setForm({ ...emptyForm, deviceId: genDeviceId() });
      setScannedValue("");
      setImage("");
      toast.success("Device registered successfully.");
      setScanMode(false);
      await getDeviceData();
      await fetchStats();
  } else {
    setError(response.data.message)
  }


      // setSuccessMsg("Device registered successfully.");
     
      
      setImage("");
   

    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to register device. Check backend or network."
      );
    } finally {
      setLoading(false);
    }
  };

  // handle QR scan results (from camera)
  const handleQrResult = async (result, error) => {
   
    if (result) {
      const qrData  = result?.text ?? result;
      
      setScannedValue(qrData );
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


    
    setForm((f) => ({
        ...f,
        ownerId: decryptedData.ownerId || f.ownerId,
        serialNumber: decryptedData.serialNumber || f.serialNumber,
      }));
      

      if (!device) {
        console.log("no device");
        
      setError("No device found for this student.");
      return;
    }

      navigate(`/device/${device.deviceId}`)

   } catch (err) {
      console.error("Failed to decrypt QR:", err);
      setError("Failed to decode QR. Make sure it is a valid device QR.");
    }

  }

  if (error && error.name !== "NotFoundException") {
    console.error("QR error:", error);
    setError("Camera error: " + (error.message || error.name));
  }
  };

  // generate QR string for current form (full device info)
  const qrValue = JSON.stringify({
    ownerId: form.ownerId,
    serialNumber: form.serialNumber,
  });
 


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Register New Device</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new device to the system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setScanMode((s) => !s)}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {scanMode ? "Close Scanner" : "Scan QR"}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Photo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Owner Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    {image ? (
                      <>
                        <img
                          className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
                          src={URL.createObjectURL(image)}
                          alt="preview"
                        />
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center hover:border-cyan-500 dark:hover:border-cyan-500 transition-colors">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add Photo</span>
                        </div>
                        <input
                          type="file"
                          name="ownerPhoto"
                          onChange={(e) => setImage(e.target.files[0])}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Device ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Device ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="deviceId"
                    value={form.deviceId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Owner Student ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="ownerId"
                    value={form.ownerId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="123416"
                  />
                </div>

                {/* Student Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="studentName"
                    value={form.studentName}
                    onChange={(e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^a-zA-Z\s]/g, '');
    const formattedValue = cleanedValue.replace(/\b\w/g, char => char.toUpperCase());
    
    setForm(prev => ({ ...prev, studentName: formattedValue }));
    
    if (errors?.studentName) {
      setErrors(prev => ({ ...prev, studentName: '' }));
    }
  }}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="Abebe"
                  />
                </div>

                {/* Student Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="studentEmail"
                    value={form.studentEmail}
                    onChange={handleChange}
                    type="email"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="abebe@example.com"
                  />
                </div>

                {/* PC Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PC Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pcType"
                    value={form.pcType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Brand</option>
                    <option value="HP">HP</option>
                    <option value="Acer">Acer</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="serialNumber"
                    value={form.serialNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="SN123456789"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="depatrment"
                    value={form.depatrment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 10) value = value.slice(0, 10);
                      setForm((f) => ({ ...f, phone: value }));
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                    placeholder="090 000 0000"
                    type="tel"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...emptyForm, deviceId: genDeviceId() });
                    setScannedValue("");
                    setError("");
                    setSuccessMsg("");
                    setImage("");
                  }}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Register Device
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}
            {successMsg && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-800 dark:text-green-300">{successMsg}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Preview Section */}
        <div className="space-y-6">
          {/* QR Preview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code Preview</h3>
              <span className="text-xs font-medium px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 rounded-full">
                Live
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-center">
              <QRCodeSVG value={qrValue} size={180} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              This QR encodes device information for easy scanning
            </p>
          </div>

          {/* Scanner Section */}
          {scanMode && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Scanner</h3>
                <button
                  onClick={() => setScanMode(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <QRScanner onScan={handleQrResult} onError={handleError} />
              </div>
              {scannedValue && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Scanned Data:</p>
                  <p className="text-sm text-gray-900 dark:text-white font-mono truncate">{scannedValue}</p>
                </div>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Point camera at device QR code to auto-fill information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

