import React, { useContext, useEffect, useState } from 'react'
import { SecurityContext } from '../context/SecurityContext'
import { Link } from "react-router-dom"
import { toast } from "react-toastify";


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'


const SecurityTodayLogout = () => {
    const { backendUrl, fetchTodayInfo, handleUnblockDevice, updateDeviceStatus, getDeviceData } = useContext(SecurityContext)
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
        
        const devicesPerPage = 5;


        const exportPDF = () => {
                const doc = new jsPDF();
                doc.setFontSize(12);
                doc.text("Today's Login Report - Security", 14, 15);
            
                const tableColumn = [
                    "Device ID", 
                    "Student Id", 
                    "Full Name", 
                    "Serial Number", 
                    "Updated At"
                ];
                const tableRows = [];
            
                devices.forEach((stu) => {
                    const rowData = [
                        stu.deviceId,
                        stu.ownerId,
                        stu.ownerName,
                        stu.serialNumber,
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
                doc.save("security_today_logins.pdf");
            }
        
            const exportExcel = () => {
                const ws = XLSX.utils.json_to_sheet(
                    devices.map((stu) => ({
                        "Device ID": stu.deviceId,
                        "Student Id": stu.ownerId,
                        "Full Name": stu.ownerName,
                        "Serial Number": stu.serialNumber,
                        "Updated At": stu.updatedAt ? new Date(stu.updatedAt).toLocaleString() : ''
                    }))
                );
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Today Logins");
                XLSX.writeFile(wb, "security_today_logins.xlsx");
            };

    const fetchTodayLogouts = async () => {
        try {
            const todayInfo = await fetchTodayInfo();
            
            // Filter today logouts (same as admin)
            const todayDevices = todayInfo.logoutsToday || [];
            
            setDevices(todayDevices);
            
        } catch (error) {
            toast.error("Failed to load today logouts");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    

    useEffect(() => {
        fetchTodayLogouts();
    }, []);


     const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const paginatedDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);

    return (
        <div className="space-y-6">
            {/* Header - Same as admin */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Today's Logout Activity</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Devices that have logged out today</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={exportPDF}
                        className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Export PDF
                    </button>
                    <button
                        onClick={exportExcel}
                        className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        Export Excel
                    </button>
                </div>
                
            </div>

            {/* Loading State - Same as admin */}
            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading today's logout data...</p>
                    </div>
                </div>
            )}

            {/* Empty State - Same as admin */}
            {!loading && devices.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow border border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Logouts Today</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">No devices have logged out today.</p>
                    </div>
                </div>
            )}

            {/* Devices Table - Same as admin but with security actions */}
            {!loading && devices.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Device ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">Last Updated</th>
                                    
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {paginatedDevices.map((device) => (
                                    <tr key={device.deviceId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/security/device/${device.deviceId}`}
                                                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium group inline-flex items-center"
                                            >
                                                {device.deviceId}
                                                <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <div className="text-gray-900 dark:text-white font-medium">{device.ownerName}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {device.ownerId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(device.updatedAt).toLocaleString()}
                                            </div>
                                        </td>
  
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-400 mb-4 sm:mb-0">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstDevice + 1}</span> to{" "}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {Math.min(indexOfLastDevice, devices.length)}
                                </span>{" "}
                                of <span className="font-semibold text-gray-900 dark:text-white">{devices.length}</span> logouts
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
                                    {Array.from({ length: Math.ceil(devices.length / devicesPerPage) }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-w-10 ${
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
                                    disabled={currentPage === Math.ceil(devices.length / devicesPerPage)}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecurityTodayLogout;