import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

export default function Dashboard1() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/dashboard/list`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard stats");
      console.error(error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Real-time system statistics and monitoring</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Devices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Devices</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats?.totalDevices || 0}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats?.totalStudents || 0}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Devices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Devices</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats?.activeDevices || 0}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Blocked Devices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Blocked Devices</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                {stats?.blockedDevices || 0}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l-2.414-2.414a1 1 0 00-.707-.293H9.414a1 1 0 00-.707.293L6.293 4.293A1 1 0 006 5v2H4a2 2 0 00-2 2v2m2-4h2v4H4v-4zm6 0h2v4h-2v-4zm6 0h2v4h-2v-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Logins */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Today's Logins</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Check-ins</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats?.loginsToday || 0}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Logouts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Today's Logouts</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Check-outs</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{stats?.logoutsToday || 0}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
            Register Device
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition">
            Add Student
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition">
            Add Officer
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
