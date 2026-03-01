import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("student_token");

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStudentData(response.data.data);
        setDeviceStatus(response.data.data.device);
      }
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {studentData?.fullName}</h1>
          <p className="text-gray-600 mt-2">Device Management Portal</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Student Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Student Info</h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-800">{studentData?.studentId}</p>
            <p className="text-gray-600 text-sm mt-2">{studentData?.email}</p>
          </div>

          {/* Department Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Department</h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-800">{studentData?.department || "N/A"}</p>
            <p className="text-gray-600 text-sm mt-2">Academic Department</p>
          </div>

          {/* Device Status Card */}
          <div className={`rounded-lg shadow-md p-6 ${
            deviceStatus?.isBlocked 
              ? 'bg-red-50' 
              : deviceStatus?.status === 'login'
              ? 'bg-green-50'
              : 'bg-yellow-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Device Status</h3>
              <div className={`w-4 h-4 rounded-full ${
                deviceStatus?.isBlocked 
                  ? 'bg-red-500' 
                  : deviceStatus?.status === 'login'
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`}></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {deviceStatus?.isBlocked 
                ? 'BLOCKED' 
                : deviceStatus?.status === 'login'
                ? 'ACTIVE'
                : 'INACTIVE'}
            </p>
            <p className="text-gray-600 text-sm mt-2">{deviceStatus?.deviceId || "No Device"}</p>
          </div>
        </div>

        {/* Device Details */}
        {deviceStatus && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Device Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Device ID</p>
                <p className="text-lg font-semibold text-gray-800">{deviceStatus.deviceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="text-lg font-semibold text-gray-800">
                  {deviceStatus.status === 'login' ? 'Checked In' : 'Checked Out'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(deviceStatus.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Access Status</p>
                <p className={`text-lg font-semibold ${
                  deviceStatus.isBlocked ? 'text-red-600' : 'text-green-600'
                }`}>
                  {deviceStatus.isBlocked ? 'Blocked' : 'Allowed'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Check In Device
            </button>
            <button className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
              Check Out Device
            </button>
            <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Scan QR Code
            </button>
            <button className="bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
