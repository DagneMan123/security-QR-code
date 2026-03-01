import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Provider
import { SecurityProvider } from "./context/SecurityContext";

// Components
import SecuritySidebar from "./components/SecuritySidebar";
import SecurityNavbar from "./components/SecurityNavbar";

// Pages
import SecurityDashboard from "./pages/SecurityDashboard";
import SecurityAllDevices from "./pages/SecurityAllDevices";
import SecurityAllStudents from "./pages/SecurityAllStudents";
import SecurityTodayLogin from "./pages/SecurityTodayLogin";
import SecurityTodayLogout from "./pages/SecurityTodayLogout";
import SecurityDeviceDetails from "./pages/SecurityDeviceDetails";
import SecurityLogin from "./pages/SecurityLogin";
import SecurityChangePassword from "./pages/SecurityChangePassword";
import SecurityProfile from "./pages/SecurityProfile";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SecurityApp = () => {
  const [token, setToken] = useState(localStorage.getItem("security_token") || "");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("security_theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("security_theme", theme);
  }, [theme]);

  // Check token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("security_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <SecurityProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={theme === "dark" ? "dark" : "light"}
          toastClassName="!rounded-xl !border !border-gray-200 dark:!border-gray-700 !shadow-lg"
          progressClassName="!bg-gradient-to-r from-blue-500 to-indigo-600"
        />
        
        {!token ? (
          <SecurityLogin setToken={setToken} />
        ) : (
          <div className="flex min-h-screen">
            <SecuritySidebar />
            <div className="flex-1 flex flex-col">
              <SecurityNavbar setToken={setToken} theme={theme} toggleTheme={toggleTheme} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path='/' element={<SecurityDashboard />} />
                  
                  <Route path='/security-dashboard' element={<SecurityDashboard />} />
                  <Route path='/security/all-devices' element={<SecurityAllDevices />} />
                  <Route path='/security/all-students' element={<SecurityAllStudents />} />
                  <Route path='/security/today-logins' element={<SecurityTodayLogin />} />
                  <Route path='/security/today-logouts' element={<SecurityTodayLogout />} />
                  <Route path='/security/device/:deviceId' element={<SecurityDeviceDetails />} />
                  <Route path='/security/change-password' element={<SecurityChangePassword />} />
                  <Route path='/security/profile' element={<SecurityProfile />} />
                  
                  {/* Catch-all route - redirect to dashboard */}
                  <Route path='*' element={<SecurityDashboard />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </div>
    </SecurityProvider>
  );
};

export default SecurityApp;