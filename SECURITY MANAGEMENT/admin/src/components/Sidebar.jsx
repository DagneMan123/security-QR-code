import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { isSidebarOpen, closeSidebar  } = useContext(AdminContext);

  const handleLinkClick = () => {
    closeSidebar();
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/list-device", label: "All Devices", icon: "devices" },
    { path: "/register-pc", label: "Register PC", icon: "add-device" },
    { path: "/manage-students", label: "Students", icon: "students" },
    { path: "/manage-security-officer", label: "Security", icon: "security" },
    { path: "/today-logins", label: "Today Logins", icon: "login" },
    { path: "/today-logouts", label: "Today Logouts", icon: "logout" },
    { path: "/blocked-devices", label: "Blocked", icon: "blocked" },
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
    "add-device": (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
    students: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0H21" />
      </svg>
    ),
    security: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
    blocked: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  };

 return (
    <>
      {/* Mobile Overlay - click to close */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      <div className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
        lg:w-64
        w-64
        bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
        transition-all duration-300 
        fixed lg:relative z-40 h-screen
        flex flex-col border-r border-gray-200 dark:border-gray-700
        ${isSidebarOpen ? "shadow-2xl lg:shadow-none" : ""}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Device Access</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick} // This will close the sidebar
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                location.pathname === item.path
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white" 
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



export default Sidebar;