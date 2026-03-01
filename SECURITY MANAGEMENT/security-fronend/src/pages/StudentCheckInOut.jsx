import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import QRScanner from "../components/QRScanner";

export default function StudentCheckInOut() {
  const [studentData, setStudentData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("student_token");

  useEffect(() => {
    const data = localStorage.getItem("student_data");
    if (data) {
      setStudentData(JSON.parse(data));
    }
    fetchDeviceStatus();
  }, []);

  const fetchDeviceStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDeviceStatus(response.data.data.device);
      }
    } catch (error) {
      console.error("Failed to fetch device status:", error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/student/check-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Device checked in successfully");
        setDeviceStatus(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/student/check-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Device checked out successfully");
        setDeviceStatus(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData) => {
    setShowScanner(false);
    // Validate QR and proceed with check-in
    try {
      const response = await axios.post(`${backendUrl}/api/devices/decrypt`, {
        qrData
      });
      if (response.data.success) {
        await handleCheckIn();
      }
    } catch (error) {
      toast.error("Invalid QR code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Device Check-in/Out</h1>
          <p className="text-gray-600">Manage your device status</p>
        </div>

        {/* Student Info Card */}
        {studentData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-semibold text-gray-800">{studentData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="text-lg font-semibold text-gray-800">{studentData.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-800">{studentData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold text-gray-800">{studentData.department}</p>
              </div>
            </div>
          </div>
        )}

        {/* Device Status Card */}
        {deviceStatus && (
          <div className={`rounded-lg shadow-md p-6 mb-6 ${
            deviceStatus.isBlocked 
              ? 'bg-red-50 border-2 border-red-300' 
              : deviceStatus.status === 'login'
              ? 'bg-green-50 border-2 border-green-300'
              : 'bg-yellow-50 border-2 border-yellow-300'
          }`}>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`w-4 h-4 rounded-full ${
                  deviceStatus.isBlocked 
                    ? 'bg-red-500' 
                    : deviceStatus.status === 'login'
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}></div>
                <p className="text-2xl font-bold text-gray-800">
                  {deviceStatus.isBlocked 
                    ? 'BLOCKED' 
                    : deviceStatus.status === 'login'
                    ? 'CHECKED IN'
                    : 'CHECKED OUT'}
                </p>
              </div>
              {deviceStatus.isBlocked && (
                <p className="text-red-600 font-semibold">Your device is blocked. Contact administrator.</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!deviceStatus?.isBlocked && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCheckIn}
              disabled={loading || deviceStatus?.status === 'login'}
              className="bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Check In"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={loading || deviceStatus?.status === 'logout'}
              className="bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Check Out"}
            </button>
          </div>
        )}

        {/* QR Scanner Button */}
        <button
          onClick={() => setShowScanner(true)}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Scan QR Code
        </button>

        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
