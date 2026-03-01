import { createContext, useState, useEffect, use } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  // Use the same theme logic as AdminContext
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme"); // Changed from "security_theme" to "theme"
      if (savedTheme) return savedTheme;
      
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches 
        ? "dark" 
        : "light";
    }
    return "light";
  });

  const [devices, setDevices] = useState([]);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("security_token") || '');


  const [securityInfo, setSecurityInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedInfo = localStorage.getItem("security_info");
      return savedInfo ? JSON.parse(savedInfo) : null;
    }
    return null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // false for mobile

// Add this function in the context (around line 60)
const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

// Add this effect to handle screen resize
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      // On desktop, sidebar should be open
      setIsSidebarOpen(true);
    } else {
      // On mobile, sidebar should be closed
      setIsSidebarOpen(false);
    }
  };
  
  // Set initial state based on screen size
  handleResize();
  
  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme); // Save with same key as admin
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem("security_token");
    localStorage.removeItem("security_token_timestamp");
    localStorage.removeItem("security_info");
    setToken('');
    setDevices([]);
    setStudent([]);
    navigate("/security-login");
  };

  const fetchSecurityProfile = async () => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        return { success: false, error: "No token" };
      }

      const response = await axios.get(`${backendUrl}/api/officer/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'token': token
        }
      });

      if (response.data.success) {
        setSecurityInfo(response.data.data);
        localStorage.setItem("security_info", JSON.stringify(response.data.data));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error("Failed to fetch security profile:", error);
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false, error: error.response?.data?.message || "Failed to fetch profile" };
    }
  };

   const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return { success: false, error: "Not authenticated" };
      }

      const id = profileData.officerId;
      setLoading(true);
      const response = await axios.patch(
        `${backendUrl}/api/officer/update-profile`,
        profileData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local security info
        setSecurityInfo(prev => ({
          ...prev,
          ...response.data.data
        }));
        
        // Update localStorage
        const updatedInfo = {
          ...securityInfo,
          ...response.data.data
        };
        localStorage.setItem("security_info", JSON.stringify(updatedInfo));
        
        toast.success("Profile updated successfully!");
        return { success: true, data: response.data };
      } else {
        toast.error(response.data.message || "Update failed");
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg);
      
      if (error.response?.status === 401) {
        logout();
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkToken = () => {
      const savedToken = localStorage.getItem("security_token");
      const timestamp = localStorage.getItem("security_token_timestamp");
      
      if (savedToken && timestamp) {
        const currentTime = Date.now();
        const tokenAge = currentTime - parseInt(timestamp);
        
        if (tokenAge > 28800000) {
          logout();
          return;
        }
        
        setToken(savedToken);
        localStorage.setItem("security_token_timestamp", currentTime.toString());
      } else {
        logout();
      }
    };
    
    checkToken();
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceData = async() => {
    try {
      setLoading(true);
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return;
      }

      const response = await axios.get(`${backendUrl}/api/devices/list`, {
        headers: { token }
      });
      
      if (response.data?.devices) {
        // Ensure proper data structure
        const formattedDevices = response.data.devices.map(device => ({
          ...device,
          isBlocked: device.isBlocked || false,
          status: device.status || 'logout',
          updatedAt: device.updatedAt || new Date().toISOString()
        }));
        setDevices(formattedDevices);
      }
    } catch (error) {
      console.error("Failed to retrieve devices:", error);
      if (error.response?.status === 401) {
        logout();
      }
      toast.error(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const getStudentData = async () => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return;
      }

      const response = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { token }
      });
      
      if (response.data?.student) {
        setStudent(response.data.student);
      }
    } catch (error) {
      console.error("Failed to retrieve students:", error);
      if (error.response?.status === 401) {
        logout();
      }
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
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return;
      }

      const res = await axios.get(`${backendUrl}/api/dashboard/list`, {
        headers: { token }
      });
      
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchTodayInfo = async () => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return;
      }

      const res = await axios.get(`${backendUrl}/api/devices/today-info`, {
        headers: { token }
      });
      
      return res.data?.data || {};
    } catch (err) {
      console.error("Failed to fetch today info:", err);
      if (err.response?.status === 401) {
        logout();
      }
      return {};
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (token) {
        await Promise.all([
          getDeviceData(),
          getStudentData(),
          fetchStats()
        ]);
      }
    };
    
    initData();
  }, []); // Remove token dependency - only run once on mount

 

const login = async (email, officerId) => {
  try {
    const response = await axios.post(`${backendUrl}/api/officer/login`, {
      email,
      officerId
    });
    
    if (response.data.token) {
      const currentTime = Date.now();
      
      // Store BOTH token AND timestamp
      localStorage.setItem("security_token", response.data.token);
      localStorage.setItem("security_token_timestamp", currentTime.toString());
      
      setToken(response.data.token);
      
      // Also fetch profile immediately after login
      await fetchSecurityProfile();
      
      return { success: true, data: response.data };
    } else {
      return { 
        success: false, 
        error: "No token received from server" 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || "Login failed" 
    };
  }
};

  
  const handleBlockDevice = async (deviceId) => {
    try {
      const token = localStorage.getItem("security_token");
      
      if (!token) {
        logout();
        return { success: false, error: "Not authenticated" };
      }

      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.deviceId === deviceId 
            ? { ...device, isBlocked: true, status: 'logout', updatedAt: new Date().toISOString() }
            : device
        )
      );

      const res = await axios.patch(
        `${backendUrl}/api/devices/officer/${deviceId}/block`,
        {},
        { headers: { token } }
      );
      

        toast.success(res.data.message);
        
        // Refresh data from backend to ensure consistency
        setTimeout(() => {
          getDeviceData();
          fetchStats();
        }, 300);
      }
     catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || "Failed to block device");
      getDeviceData();
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateDeviceStatus = async (deviceId, status) => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return { success: false, error: "Not authenticated" };
      }

      // First update local state immediately for better UX
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.deviceId === deviceId 
            ? { ...device, status: status, updatedAt: new Date().toISOString() }
            : device
        )
      );

      const res = await axios.patch(
        `${backendUrl}/api/devices/update/${deviceId}/status`,
        { status },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(`Device status updated to ${status}`);
        
        setTimeout(() => {
          getDeviceData();
          fetchStats();
        }, 300);
        
        
        toast.success(res.data.message);
        getDeviceData(); 
        return { success: true };

      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update device status");
      
      getDeviceData();
      return { success: false, error: error.response?.data?.message };
    }
  };


  const verifyQRCode = async (qrData) => {
    try {
      const token = localStorage.getItem("security_token");
      if (!token) {
        logout();
        return { success: false, error: "Not authenticated" };
      }

      const decryptResponse = await axios.post(
        `${backendUrl}/api/devices/decrypt`,
        { qrData },
        { headers: { token } }
      );
      
      if (decryptResponse.data.success) {
        const decryptedData = decryptResponse.data.data;
        
        const deviceRes = await axios.get(
          `${backendUrl}/api/devices/by-owner/${decryptedData.ownerId}`,
          { headers: { token } }
        );
        
        if (deviceRes.data.device) {
          return { success: true, device: deviceRes.data.device };
        } else {
          return { success: false, error: "Device not found" };
        }
      } else {
        return { success: false, error: decryptResponse.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid QR code";
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false, error: errorMsg };
    }
  };

 

  const value = {
    theme, 
    toggleTheme, 
    devices, 
    student, 
    loading,
    setDevices, 
    stats, 
    fetchStats, 
    setStudent, 
    navigate, 
    backendUrl, 
    getDeviceData, 
    getStudentData,
    fetchTodayInfo,
    securityInfo,
    fetchSecurityProfile,
    updateProfile,
    token, 
    setToken,
    login,
    logout,
    handleBlockDevice,
    updateDeviceStatus,
    verifyQRCode,
    isSidebarOpen,
    toggleSidebar,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};