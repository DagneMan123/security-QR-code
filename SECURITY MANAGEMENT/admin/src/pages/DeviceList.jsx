import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'


const DeviceList = () => {
  const [search, setSearch] = useState("");
  const [block, setBlocked] = useState("")
  const [filteredDevices, setFilteredDevices] = useState([])
  const [pcType, setPcType] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const devicesPerPage = 5;




  const {theme, toggleTheme, devices, setDevices, backendUrl, fetchStats, getDeviceData, token } = useContext(AdminContext)


 const applyFilter = () => {

  let deviceCopy = devices.slice()
   if (search) {

    deviceCopy = deviceCopy.filter((d) =>
      d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      d.ownerId.toLowerCase().includes(search.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(search.toLowerCase())

  );
   } 

   if (pcType) {
    deviceCopy = deviceCopy.filter(
      (device) => device.deviceType.toLowerCase() === pcType.toLowerCase()
    );
  }


  if (status) {
    deviceCopy = deviceCopy.filter(
      (device) => device.status.toLowerCase() === status.toLowerCase()
    )
  }

    setFilteredDevices(deviceCopy)
 }


 const handleStatus = async (deviceId, status) => {
  try {
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    console.log("Updating device status:", { deviceId, status, token: token.substring(0, 20) + "..." });

    await axios.patch(
      `${backendUrl}/api/devices/update/${deviceId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDevices(prev =>
  prev.map(d =>
    d.deviceId === deviceId
      ? { ...d, status, updatedAt: new Date().toISOString() }
      : d
  )
);
    await fetchStats();
    await getDeviceData();
    
    toast.success("Device status updated");
  } catch (error) {
    console.error("Status update error:", error);
    console.error("Error response:", error.response?.data);
    
    if (error.response?.status === 403) {
      toast.error("Access denied. Admin role required. Please login again.");
    } else if (error.response?.status === 401) {
      toast.error("Token expired. Please login again.");
    } else {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  }
};


const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Student List", 14, 15);

    const tableColumn = [
      "Device ID", 
      "Full Name", 
      "Department", 
      "Student Id", 
      "Student Email", 
      "Student Phone", 
      "Device Status", 
      "Device Type", 
      "Serial Number", 
      "Created At", 
      "Updated At"];
    const tableRows = [];

    devices.forEach((stu) => {
      const rowData = [
        stu.deviceId,
        stu.Student.fullName,
        stu.Student.department,
        stu.ownerId,
        stu.Student.email,
        stu.Student.phone,
        stu.status,
        stu.deviceType,
        stu.serialNumber,
        stu.createdAt ? new Date(stu.createdAt).toLocaleString() : '',
        stu.updatedAt ? new Date(stu.updatedAt).toLocaleString() : '',
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8 }
    });
    doc.save("student_list.pdf");
  };

const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      devices.map((stu) => ({
        "Device ID": stu.deviceId,
        "Full Name": stu.Student.fullName,
        Department: stu.Student.department,
        "Student Id": stu.ownerId,
        Email: stu.Student.email,
        Phone: stu.Student.phone,
        "Device Status": stu.status,
        "Device Type": stu.deviceType,
        "Serial Number": stu.serialNumber,
        "Created At": stu.createdAt ? new Date(stu.createdAt).toLocaleString()
          : '',
        "Updated At": stu.updatedAt ? new Date(stu.updatedAt).toLocaleString() : ''
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student_list.xlsx");
  };



useEffect(() => {
  setFilteredDevices(devices);
  fetchStats();
}, [devices, devices.status]);

 useEffect(() => {
  setFilteredDevices(devices)
  // console.log(devices)
 },[devices.isBlocked])


 useEffect(() => {
        applyFilter()
        setCurrentPage(1);
      },[search, pcType, status])


      const indexOfLastDevice = currentPage * devicesPerPage;
const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;

const paginatedDevices = filteredDevices.slice(
  indexOfFirstDevice,
  indexOfLastDevice
);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Device Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all registered devices and their status</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search devices..."
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Export & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PC Type</label>
                <select
                  value={pcType}
                  onChange={(e) => setPcType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All PC Types</option>
                  <option value="HP">HP</option>
                  <option value="Acer">Acer</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={status}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Login">Login</option>
                  <option value="Logout">Logout</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Results</label>
                <div className="px-4 py-2.5 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{filteredDevices.length} devices found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <div className="flex space-x-3 w-full">
            <button
              onClick={exportPDF}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  <div className="flex items-center">
                    Device ID
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Owner ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Serial</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">PC Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedDevices.map((device) => (
                <tr key={device.deviceId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/device/${device.deviceId}`}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium group inline-flex items-center"
                    >
                      {device.deviceId}
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">{device.ownerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      {device.serialNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        device.deviceType === "HP" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        device.deviceType === "Acer" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                        device.deviceType === "Lenovo" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {device.deviceType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name="status"
                      onChange={(e) => handleStatus(device.deviceId, e.target.value)}
                      value={device.status || 'login'}
                      className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors min-w-[100px]"
                    >
                      <option value="logout" className="bg-white dark:bg-gray-800">Logout</option>
                      <option value="login" className="bg-white dark:bg-gray-800">Login</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {device.createdAt
                      ? new Date(device.createdAt).toLocaleString({ hour12: false })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {device.updatedAt
                      ? new Date(device.updatedAt).toLocaleString({ hour12: false })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {devices.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No devices found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by registering a new device.</p>
            <div className="mt-6">
              <Link
                to="/register-pc"
                className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Register New Device
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {devices.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstDevice + 1}</span> to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(indexOfLastDevice, filteredDevices.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-900 dark:text-white">{filteredDevices.length}</span> devices
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.ceil(filteredDevices.length / devicesPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-10px ${
                    currentPage === i + 1
                      ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === Math.ceil(filteredDevices.length / devicesPerPage)}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DeviceList;
