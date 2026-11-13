import { createContext, useState, useEffect } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;
      
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches 
        ? "dark" 
        : "light";
    }
    return "light";
  });

  const [devices, setDevices] = useState([]);
  const [officer, setOfficer] = useState([]);
  const [student, setStudent] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Intercept 401 responses (expired or invalid token) and automatically clear token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Session expired or unauthorized (401). Clearing session...");
          setToken("");
          localStorage.removeItem("token");
          toast.error("Session expired. Please log in again.");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Single useEffect for theme management
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const getDeviceData = async() => {
    try {
      const response = await axios.get(`${backendUrl}/api/devices/list`);
      if (response.data?.devices) {
        setDevices(response.data.devices);
      } else {
        toast.error(response.data?.message || "No devices found");
      }
    } catch (error) {
      console.error("Failed to retrieve devices:", error);
      toast.error(error.message || "Request failed");
    }
  };

  const getStudentData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/student/list`);
      if (response.data?.student) {
        setStudent(response.data.student);
      } else {
        toast.error(response.data?.message || "No devices found");
      }
    } catch (error) {
      console.error("Failed to retrieve devices:", error);
      toast.error(error.message || "Request failed");
    }
  };

  const [stats, setStats] = useState({
    totalDevices: 0,
    totalStudents: 0,
    blockedDevices: 0,
    activeDevices: 0,
    loginsToday: 0,
    logoutsToday: 0,
    recentActivity: [],
    labels: [], 
    loginsData: [], 
    logoutsData: [],
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/dashboard/list`);
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOfficers = async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) return;

    try {
      const res = await axios.get(backendUrl + "/api/officer/list", {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setOfficer(res.data.data || []);
      console.log("Officers fetched:", res.data.data);
    } catch (err) {
      console.error("Failed to fetch officers:", err);
      if (err.response?.status === 401) {
        setToken("");
        localStorage.removeItem("token");
      }
      setOfficer([]);
    }
  };

  useEffect(() => {
    getStudentData();
    fetchStats();
    getDeviceData();
    if (token) {
      fetchOfficers();
    }
  }, [token]);

  const value = {
    theme, 
    toggleTheme, 
    devices, 
    student, 
    setDevices, 
    stats, 
    fetchStats, 
    setStudent, 
    navigate, 
    backendUrl, 
    getDeviceData, 
    getStudentData, 
    officer, 
    setOfficer, 
    fetchOfficers,
    token, 
    setToken, 
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
