import React, { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import DeviceItem from "./pages/DeviceItem";
import RegisterDevice from "./pages/RegisterDevice";
import ManageStudents from "./pages/ManageStudents";
import RegisterStudent from "./pages/RegisterStudent";
import ManageSecurityOfficer from "./pages/ManageSecurityOfficer";
import EditSecurityOfficer from "./pages/EditSecurityOfficer";
import Login from "./pages/Login";
import AddSecurity from "./pages/AddSecurity";
import TodayLogin from "./pages/TodayLogin";
import TodayLogout from "./pages/Todaylogout";
import BlockedDevices from "./pages/BlockedDevices";
import { AdminContext } from "./context/AdminContext";
import Security from "./pages/Security";



export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(AdminContext);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Store token
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={theme === "dark" ? "dark" : "light"}
          toastClassName="!rounded-xl !border !border-gray-200 dark:!border-gray-700 !shadow-lg"
          progressClassName="!bg-gradient-to-r from-cyan-500 to-blue-600"
        />
        
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      {/* Mobile Overlay - Shows when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
            <div className="flex-1 flex flex-col  ">
              <Navbar setToken={setToken} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/register-pc' element={<RegisterDevice />} />
                  <Route path='/add/security' element={<AddSecurity />} />
                  <Route path='/register-student' element={<RegisterStudent />} />
                  <Route path='/device/:deviceId' element={<DeviceItem />} />
                  <Route path='/manage-security' element={<ManageSecurityOfficer />} />
                  <Route path='/manage-security-officer' element={<ManageSecurityOfficer />} />
                  <Route path='/security-officer/:officerId/edit' element={<EditSecurityOfficer />} />
                  <Route path='/manage-students' element={<ManageStudents />} />
                  <Route path='/list-device' element={<DeviceList />} />
                  <Route path='/today-logins' element={<TodayLogin />} />
                  <Route path='/today-logouts' element={<TodayLogout />} />
                  <Route path='/blocked-devices' element={<BlockedDevices />} />
                  <Route path="/security-officer/:officerId" element={<Security />} />
                </Routes>
              </main>
            </div>
          </div>
        )}
      </div>
  );
};


export default App;

