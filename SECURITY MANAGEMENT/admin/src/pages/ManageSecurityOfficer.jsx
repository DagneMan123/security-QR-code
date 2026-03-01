import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ManageSecurityOfficer = () => {
  const { officer, setOfficer, fetchOfficers, navigate, token } = useContext(AdminContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // State for filtering and pagination
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingOfficerId, setLoadingOfficerId] = useState(null);
  const officersPerPage = 5;

  // Apply filters function
  const applyFilter = () => {
    let officerCopy = [...officer];

    // Apply search filter
    if (search) {
      officerCopy = officerCopy.filter(
        (o) =>
          o.officerId?.toLowerCase().includes(search.toLowerCase()) ||
          o.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          o.email?.toLowerCase().includes(search.toLowerCase()) ||
          o.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "") {
      officerCopy = officerCopy.filter((o) => {
        if (statusFilter === "active") return o.isActive === true;
        if (statusFilter === "inactive") return o.isActive === false;
        return true;
      });
    }

    setFilteredOfficers(officerCopy);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Initialize filtered officers
  useEffect(() => {
    setFilteredOfficers(officer);
  }, [officer]);

  // Apply filters when search or status changes
  useEffect(() => {
    applyFilter();
  }, [search, statusFilter]);

  // Pagination calculations
  const indexOfLastOfficer = currentPage * officersPerPage;
  const indexOfFirstOfficer = indexOfLastOfficer - officersPerPage;
  const paginatedOfficers = filteredOfficers.slice(indexOfFirstOfficer, indexOfLastOfficer);

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Security Officers List", 14, 15);

    const tableColumn = [
      "Officer ID",
      "Full Name",
      "Email",
      "Phone",
      "Status",
      "Created At",
      "Updated At"
    ];
    const tableRows = [];

    officer.forEach((officer) => {
      const rowData = [
        officer.officerId || "N/A",
        officer.fullName || "N/A",
        officer.email || "N/A",
        officer.phone || "N/A",
        officer.isActive ? "Active" : "Inactive",
        officer.createdAt ? new Date(officer.createdAt).toLocaleString() : "N/A",
        officer.updatedAt ? new Date(officer.updatedAt).toLocaleString() : "N/A"
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    doc.save("security_officers_list.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      officer.map((officer) => ({
        "Officer ID": officer.officerId || "N/A",
        "Full Name": officer.fullName || "N/A",
        "Email": officer.email || "N/A",
        "Phone": officer.phone || "N/A",
        "Status": officer.isActive ? "Active" : "Inactive",
        "Created At": officer.createdAt ? new Date(officer.createdAt).toLocaleString() : "N/A",
        "Updated At": officer.updatedAt ? new Date(officer.updatedAt).toLocaleString() : "N/A"
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Security Officers");
    XLSX.writeFile(wb, "security_officers_list.xlsx");
  };

  // Toggle officer status
  const toggleStatus = async (officerId, currentStatus) => {
    try {
      setLoadingOfficerId(officerId);
      const res = await axios.patch(
        `${backendUrl}/api/officer/${officerId}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        setOfficer((prev) =>
          prev.map((o) =>
            o.officerId === officerId ? { ...o, isActive: !currentStatus } : o
          )
        );
        await fetchOfficers();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingOfficerId(null);
    }
  };

  // Delete officer
  const handleDelete = async (officerId) => {
    if (!window.confirm("Are you sure you want to delete this officer?")) {
      return;
    }

    try {
      setLoadingOfficerId(officerId);
      const res = await axios.delete(
        `${backendUrl}/api/officer/${officerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        toast.success(res.data.message || "Officer deleted successfully");
        setOfficer((prev) => prev.filter((d) => d.officerId !== officerId));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete officer");
    } finally {
      setLoadingOfficerId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Security Officers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage security personnel and access
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search officers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link
            to="/add/security"
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Security
          </Link>
        </div>
      </div>

      {/* Export & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Results
                </label>
                <div className="px-4 py-2.5 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {filteredOfficers.length} officers
                  </span>
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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Officer ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedOfficers.map((officer) => (
                <tr
                  key={officer.officerId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/security-officer/${officer.officerId}/edit`}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium group inline-flex items-center"
                    >
                      {officer.officerId}
                      <svg
                        className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{officer.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">{officer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-700 dark:text-gray-300">{officer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        officer.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={officer.isActive ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                        />
                      </svg>
                      {officer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(officer.officerId, officer.isActive)}
                        disabled={loadingOfficerId === officer.officerId}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          loadingOfficerId === officer.officerId
                            ? "opacity-50 cursor-not-allowed"
                            : officer.isActive
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800"
                        }`}
                      >
                        {loadingOfficerId === officer.officerId ? (
                          <>
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          officer.isActive ? "Disable" : "Enable"
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(officer.officerId)}
                        disabled={loadingOfficerId === officer.officerId}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          loadingOfficerId === officer.officerId
                            ? "opacity-50 cursor-not-allowed bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                        }`}
                      >
                        {loadingOfficerId === officer.officerId ? (
                          <>
                            <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {officer.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No security officers
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Add security officers to manage access.
            </p>
            <div className="mt-6">
              <Link
                to="/add/security"
                className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Security Officer
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {officer.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-400 mb-4 sm:mb-0">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {indexOfFirstOfficer + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(indexOfLastOfficer, filteredOfficers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredOfficers.length}
            </span>{" "}
            officers
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from(
                { length: Math.ceil(filteredOfficers.length / officersPerPage) },
                (_, i) => (
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
                )
              )}
            </div>
            <button
              disabled={currentPage === Math.ceil(filteredOfficers.length / officersPerPage)}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSecurityOfficer;