import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DeviceTable = () => {
    const{devices, navigate, backendUrl, getDeviceData, token} = useContext(AdminContext)
    
    const handleStatusChange = async (deviceId, newStatus) => {
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.patch(
          `${backendUrl}/api/devices/update/${deviceId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success || response.status === 200) {
          toast.success(`Device status updated to ${newStatus}`);
          getDeviceData(); // Refresh the device list
        } else {
          toast.error(response.data?.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Status update error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update status");
      }
    };

    const handleSetAllLogout = async () => {
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      if (!window.confirm("Are you sure you want to set ALL devices to logout status?")) {
        return;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/api/devices/set-all-logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          toast.success(`${response.data.count} devices set to logout status`);
          getDeviceData(); // Refresh the device list
        } else {
          toast.error(response.data?.message || "Failed to set devices to logout");
        }
      } catch (error) {
        console.error("Set all logout error:", error);
        console.error("Error response:", error.response?.data);
        toast.error(error.response?.data?.message || error.message || "Failed to set devices to logout");
      }
    };

    const handleBlockChange = async (deviceId, newBlockStatus) => {
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      try {
        console.log("Blocking device:", deviceId, "Status:", newBlockStatus);
        const response = await axios.patch(
          `${backendUrl}/api/devices/update/${deviceId}/block`,
          { isBlocked: newBlockStatus === 'Block' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log("Block response:", response.data);
        
        if (response.data.success || response.status === 200) {
          toast.success(`Device ${newBlockStatus === 'Block' ? 'blocked' : 'unblocked'} successfully`);
          // Refresh after a short delay to ensure database is updated
          setTimeout(() => getDeviceData(), 500);
        } else {
          toast.error(response.data?.message || "Failed to update block status");
        }
      } catch (error) {
        console.error("Block update error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to update block status";
        toast.error(errorMsg);
      }
    };

    const handleDelete = async (deviceId) => {
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      if (window.confirm('Are you sure you want to delete this device? This will also delete associated students.')) {
        try {
          console.log("Deleting device:", deviceId);
          const response = await axios.delete(
            `${backendUrl}/api/devices/${deviceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          console.log("Delete response:", response.data);
          
          if (response.data.success || response.status === 200) {
            toast.success("Device deleted successfully");
            // Refresh after a short delay to ensure database is updated
            setTimeout(() => getDeviceData(), 500);
          } else {
            toast.error(response.data?.message || "Failed to delete device");
          }
        } catch (error) {
          console.error("Delete error:", error);
          const errorMsg = error.response?.data?.message || error.message || "Failed to delete device";
          toast.error(errorMsg);
        }
      }
    };
    
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleSetAllLogout}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Set All Devices to Logout
        </button>
      </div>
      <table className="min-w-full bg-white border rounded  w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-4 border">Device ID</th>
              <th className="py-2 px-4 border">Owner ID</th>
              <th className="py-2 px-4 border">Serial</th>
              <th className="py-2 px-4 border">OS</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Blocked</th>
              <th className="py-2 px-4 border"></th>

            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.deviceId}>
                <td className=" px-4 py-2">
                <Link to={`/device/${device.deviceId}`}>{device.deviceId}</Link></td>
                <td className=" px-4 py-2">{device.ownerId}</td>
                <td className=" px-4 py-2">{device.serialNumber}</td>
                <td className=" px-4 py-2">{device.deviceType || 'N/A'}</td>
                <td className=" px-4 py-2">
                  <select
                    name="status"
                    value={device.status || 'login'}
                    onChange={(e) => handleStatusChange(device.deviceId, e.target.value)}
                    className="p-2 rounded border"
                  >
                    <option value="logout">Logout</option>
                    <option value="login">Login</option>
                  </select>
                </td>
                
               
                <td className=" px-4 py-2">
                  <select
                    name="block"
                    value={device.isBlocked ? 'Block' : 'UnBlock'}
                    onChange={(e) => handleBlockChange(device.deviceId, e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="Block">Block</option>
                    <option value="UnBlock">UnBlock</option>
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(device.deviceId)}
                    className="bg-red-400 px-3 py-2 rounded-2xl hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
         </table>
    </div>
  )
}

export default DeviceTable
