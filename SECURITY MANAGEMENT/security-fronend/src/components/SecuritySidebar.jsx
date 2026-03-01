import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SecurityContext } from "../context/SecurityContext";

const SecuritySidebar = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useContext(SecurityContext);

  const navItems = [
    { path: "/security-dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/security/all-devices", label: "All Devices", icon: "devices" },
    { path: "/security/all-students", label: "Students", icon: "students" },
    { path: "/security/today-logins", label: "Today Logins", icon: "login" },
    { path: "/security/today-logouts", label: "Today Logouts", icon: "logout" },
  ];

  const profileItems = [
    { path: "/security/profile", label: "My Profile", icon: "profile" },
    { path: "/security/change-password", label: "Change Password", icon: "password" },
  ];

  const icons = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    devices: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    students: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21" />
      </svg>
    ),
    login: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    profile: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    password: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  return (
    <>
      {/* Mobile Overlay - Shows when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        /* Mobile: Hidden by default, shows when toggled */
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        /* Desktop: Always visible */
        lg:translate-x-0
        /* Fixed positioning for mobile,  for desktop */
        fixed lg:relative z-50
        /* Width */
        w-64 
        /* Styling */
        bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
        transition-all duration-300 
        flex flex-col border-r border-gray-200 dark:border-gray-700
        h-screen
        /* Shadow on mobile when open */
        ${isSidebarOpen ? "shadow-2xl lg:shadow-none" : ""}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Security Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">Main</h3>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile when clicking a link
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-blue-500 to-indigo-600" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
                {icons[item.icon]}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          <div className="mt-6 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">Account</h3>
          </div>
          {profileItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close sidebar on mobile when clicking a link
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-blue-500 to-indigo-600" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
                {icons[item.icon]}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SecuritySidebar;