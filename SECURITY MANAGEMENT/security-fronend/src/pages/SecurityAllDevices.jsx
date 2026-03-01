import React, { useContext, useState, useEffect, useCallback } from 'react'
import { SecurityContext } from '../context/SecurityContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const SecurityAllDevices = () => {
  const { devices, handleBlockDevice, updateDeviceStatus, getDeviceData, loading, backendUrl, token } = useContext(SecurityContext)
  const [filteredDevices, setFilteredDevices] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [processingId, setProcessingId] = useState(null)
  const [bulkProcessing, setBulkProcessing] = useState(false)
  const devicesPerPage = 10

  // Initialize with devices
  useEffect(() => {
    setFilteredDevices(devices)
  }, [devices])

  // Apply filters whenever search, statusFilter, or devices change
  useEffect(() => {
    applyFilter()
  }, [search, statusFilter, devices])

  const applyFilter = useCallback(() => {
    let filtered = [...devices]
    
    if (search) {
      filtered = filtered.filter(device =>
        device.deviceId?.toLowerCase().includes(search.toLowerCase()) ||
        device.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
        device.ownerId?.toLowerCase().includes(search.toLowerCase()) ||
        device.serialNumber?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (statusFilter) {
      if (statusFilter === 'blocked') {
        filtered = filtered.filter(device => device.isBlocked)
      } else {
        filtered = filtered.filter(device => device.status === statusFilter)
      }
    }

    setFilteredDevices(filtered)
    setCurrentPage(1)
  }, [search, statusFilter, devices])

  const handleStatusChange = async (deviceId, newStatus) => {
    setProcessingId(deviceId)
    try {
      const result = await updateDeviceStatus(deviceId, newStatus)
        toast.success(`Device status updated to ${newStatus}`)

      
    } catch (error) {
      toast.error("Failed to update status")
    } finally {
      setProcessingId(null)
    }
  }

  const handleBlock = async (deviceId) => {
    setProcessingId(deviceId)
    try {
      if (!window.confirm('Are you sure you want to block this device?')) {
        setProcessingId(null)
        return
      }

      const result = await handleBlockDevice(deviceId)
      
    } catch (error) {
      toast.error("Failed to block ")
    } finally {
      setProcessingId(null)
    }
  }

  const handleSetAllActive = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to set ALL devices to ACTIVE status?")) {
      return;
    }

    setBulkProcessing(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/devices/set-all-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`${response.data.count} devices set to ACTIVE status`);
        getDeviceData();
      } else {
        toast.error(response.data.message || "Failed to set devices to active");
      }
    } catch (error) {
      console.error("Set all active error:", error);
      toast.error(error.response?.data?.message || "Failed to set devices to active");
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleSetAllInactive = async () => {
    if (!token) {
      toast.error("Authentication token not found. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to set ALL devices to INACTIVE status?")) {
      return;
    }

    setBulkProcessing(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/devices/set-all-inactive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`${response.data.count} devices set to INACTIVE status`);
        getDeviceData();
      } else {
        toast.error(response.data.message || "Failed to set devices to inactive");
      }
    } catch (error) {
      console.error("Set all inactive error:", error);
      toast.error(error.response?.data?.message || "Failed to set devices to inactive");
    } finally {
      setBulkProcessing(false);
    }
  };

  const indexOfLastDevice = currentPage * devicesPerPage
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage
  const paginatedDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">All Devices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and monitor all registered devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={getDeviceData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={handleSetAllActive}
            disabled={bulkProcessing || devices.length === 0}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            <svg className={`w-5 h-5 mr-2 ${bulkProcessing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {bulkProcessing ? 'Processing...' : 'Set All Active'}
          </button>
          <button
            onClick={handleSetAllInactive}
            disabled={bulkProcessing || devices.length === 0}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
          >
            <svg className={`w-5 h-5 mr-2 ${bulkProcessing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {bulkProcessing ? 'Processing...' : 'Set All Inactive'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 bg-white dark:bg-gray-900 border border-gray-200 dark:text-white dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="login">Active (Login)</option>
              <option value="logout">Inactive (Logout)</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div>
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{filteredDevices.length} devices</span>
              {devices.length !== filteredDevices.length && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  (filtered from {devices.length})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && devices.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading devices...</p>
          </div>
        </div>
      )}

      {/* Devices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedDevices.map((device) => (
                <tr key={device.deviceId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/security/device/${device.deviceId}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      {device.deviceId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{device.ownerName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{device.ownerId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300 font-mono text-sm">{device.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      device.isBlocked 
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                        : device.status === "login" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {device.isBlocked ? "Blocked" : device.status === "login" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {device.updatedAt ? new Date(device.updatedAt).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {!device.isBlocked ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(device.deviceId, "login")}
                            disabled={device.status === "login" || processingId === device.deviceId}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              device.status === "login" || processingId === device.deviceId
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 cursor-not-allowed"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                            }`}
                          >
                            {processingId === device.deviceId ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              "Set Active"
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusChange(device.deviceId, "logout")}
                            disabled={device.status === "logout" || processingId === device.deviceId}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              device.status === "logout" || processingId === device.deviceId
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 cursor-not-allowed"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800"
                            }`}
                          >
                            {processingId === device.deviceId ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              "Set Inactive"
                            )}
                          </button>
                          <button
                            onClick={() => handleBlock(device.deviceId)}
                            disabled={processingId === device.deviceId}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                          >
                            {processingId === device.deviceId ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Blocking...
                              </span>
                            ) : (
                              "Block"
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          Device Blocked
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredDevices.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No devices found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredDevices.length > 0 && (
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
              onClick={() => setCurrentPage(p => p - 1)}
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
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-10 ${
                    currentPage === i + 1
                      ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === Math.ceil(filteredDevices.length / devicesPerPage)}
              onClick={() => setCurrentPage(p => p + 1)}
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

export default SecurityAllDevices;