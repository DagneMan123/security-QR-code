import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { AdminContext } from "../context/AdminContext";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);




const Dashboard = () => {
  const { devices, stats } = useContext(AdminContext);

  const lineData = {
    labels: stats.labels,
    datasets: [
      {
        label: "Logins",
        data: stats.loginsData,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: "Logouts",
        data: stats.logoutsData,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#6b7280",
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor device and student activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>System Active • Real-time</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon="device"
          color="blue"
          link="/list-device"
          trend={`+${stats.loginsToday} new`}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="user"
          color="emerald"
          link="/manage-students"
          trend={`+${stats.loginsToday - stats.logoutsToday} net`}
        />
        <StatCard
          title="Logins Today"
          value={stats.loginsToday}
          icon="login"
          color="green"
          link="/today-logins"
          trend="Active"
        />
        <StatCard
          title="Logouts Today"
          value={stats.logoutsToday}
          icon="logout"
          color="amber"
          link="/today-logouts"
          trend="In Active"
        />
        <StatCard
          title="Blocked Devices"
          value={stats.blockedDevices}
          icon="shield"
          color="red"
          link="/blocked-devices"
          trend="Secure"
        />
        <StatCard
          title="Active Devices"
          value={stats.activeDevices}
          icon="activity"
          color="cyan"
          link="/list-device"
          trend="+5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        {/* {console.log(stats)} */}
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Activity Trend</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Login vs Logout patterns</p>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              Last 7 days
            </span>
          </div>
          <div className="h-80">
            {stats.labels.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
                </div>
              </div>
            )}
          </div>
        </div>


      
<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Device Status</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current device distribution</p>
    </div>
    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
      Real-time
    </span>
  </div>
  <div className="h-80">
    {devices.length > 0 ? (
      <>
      
        <div className="flex items-center justify-center h-3/4">
          <div className="relative w-48 h-48">
            {/* Pie Chart using CSS */}
            <div className="absolute inset-0 rounded-full border-8 border-emerald-500" 
                 style={{ clipPath: `inset(0 ${100 - (stats.activeDevices / stats.totalDevices * 100)}% 0 0)` }}></div>
            <div className="absolute inset-0 rounded-full border-8 border-blue-500" 
                 style={{ clipPath: `inset(0 0 0 ${stats.activeDevices / stats.totalDevices * 100}%)` }}></div>
            <div className="absolute inset-0 rounded-full border-8 border-amber-500" 
                 style={{ clipPath: `circle(${stats.blockedDevices / stats.totalDevices * 50}% at center)` }}></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalDevices}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Devices</span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeDevices}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round((stats.activeDevices / stats.totalDevices) * 100)}% of total
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Not Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalDevices - stats.activeDevices - stats.blockedDevices}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round(((stats.totalDevices - stats.activeDevices - stats.blockedDevices) / stats.totalDevices) * 100)}%
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Blocked</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.blockedDevices}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round((stats.blockedDevices / stats.totalDevices) * 100)}% of total
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No device data available</p>
        </div>
      </div>
    )}
  </div>
</div>
        {/* Peak Hours */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lab Utilization</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today's peak usage hours</p>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              Live
            </span>
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="space-y-5">
                {["8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM", "4-6 PM"].map((time, index) => (
                  <div key={time} className="flex items-center space-x-4">
                    <span className="w-20 text-sm text-gray-600 dark:text-gray-400 font-medium">{time}</span>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${[25, 60, 35, 85, 40][index]}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="w-10 text-sm font-bold text-gray-700 dark:text-gray-300">
                      {[25, 60, 35, 85, 40][index]}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low Usage</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Peak Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity Log</h2>
          <Link
            to="/today-logins"
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
                {/* <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"> */}
                  {/* Status
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {stats.recentActivity.map((log, i) => (
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
                  {/* <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        log.status === "Success"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {log.status === "Success" ? (
                          <>
                            <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Verified
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Processing
                          </>
                        )}
                      </div>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
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

export default Dashboard;
