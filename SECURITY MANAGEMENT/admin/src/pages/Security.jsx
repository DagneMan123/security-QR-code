import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const Security = () => {
  const { officerId } = useParams();
  const { officer, navigate, backendUrl, setOfficer, fetchOfficers } = useContext(AdminContext);
  const [securityOfficer, setSecurityOfficer] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [form, setForm] = useState({
    officerId: "",
    fullName: "",
    email: "",
    phone: "",
    isActive: true
  });

  useEffect(() => {
    const fetchData = officer.find(o => o.officerId === officerId);
    
    if (fetchData) {
      setSecurityOfficer(fetchData);
      setForm({
        officerId: fetchData.officerId,
        fullName: fetchData.fullName,
        email: fetchData.email,
        phone: fetchData.phone,
        isActive: fetchData.isActive
      });
    }
  }, [officerId, officer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const toggleStatus = async (officerId, currentStatus) => {
    try {
      await axios.patch(`${backendUrl}/api/officer/${officerId}/status`);
      
      setOfficer(prev =>
        prev.map(o =>
          o.officerId === officerId
            ? { ...o, isActive: !currentStatus }
            : o
        )
      );
      setSecurityOfficer(prev => prev ? { ...prev, isActive: !currentStatus } : null);
      await fetchOfficers();
      
      toast.success(`Officer ${!currentStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this security officer?")) {
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/officer/${officerId}`);
      
      toast.success("Security officer deleted successfully");
      navigate("/manage-security");
      setOfficer(prev => prev.filter(o => o.officerId !== officerId));
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete security officer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedOfficer = await axios.put(`${backendUrl}/api/officer/${form.officerId}`, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      });

      setOfficer(prev =>
        prev.map(o =>
          o.officerId === form.officerId
            ? { ...o, ...form }
            : o
        )
      );
      
      setSecurityOfficer(prev => prev ? { ...prev, ...form } : null);
      await fetchOfficers();
      
      toast.success("Security officer updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to update security officer");
      console.error(error);
    }
  };

  if (!securityOfficer) return <p className="text-center mt-10">Security officer not found</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Security Officer Details</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage security officer information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Officer
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Officer Profile</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${securityOfficer.isActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                {securityOfficer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-64 flex items-center justify-center bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-linear-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                    {securityOfficer.fullName?.charAt(0).toUpperCase() || "S"}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{securityOfficer.fullName}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Security Officer</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => toggleStatus(securityOfficer.officerId, securityOfficer.isActive)}
                className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl transition-all ${securityOfficer.isActive ? "bg-linear-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/25" : "bg-linear-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/25"} text-white hover:shadow-lg`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={securityOfficer.isActive ? "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"} />
                </svg>
                {securityOfficer.isActive ? "Deactivate Officer" : "Activate Officer"}
              </button>
              
              <button
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Officer
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Officer Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Officer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Officer ID" value={securityOfficer?.officerId} icon="id" />
              <InfoCard label="Full Name" value={securityOfficer?.fullName} icon="name" />
              <InfoCard label="Email" value={securityOfficer?.email} icon="email" />
              <InfoCard label="Phone" value={securityOfficer?.phone} icon="phone" />
              <InfoCard 
                label="Status" 
                value={securityOfficer?.isActive ? "Active" : "Inactive"} 
                icon="status" 
                badge={securityOfficer?.isActive ? "success" : "danger"}
              />
              <InfoCard 
                label="Account Type" 
                value="Security Officer" 
                icon="security" 
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Access Information</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Can Scan QR Codes:</span>
                    <span className="ml-2 font-medium text-green-600 dark:text-green-400">Yes</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Can View Devices:</span>
                    <span className="ml-2 font-medium text-green-600 dark:text-green-400">Yes</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Can Manage Devices:</span>
                    <span className="ml-2 font-medium text-red-600 dark:text-red-400">No</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Access Level:</span>
                    <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">Limited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditOfficerModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

// Info Card Component
const InfoCard = ({ label, value, icon, badge }) => {
  const icons = {
    id: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    name: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    phone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    status: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    security: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  const badgeStyles = {
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-3">
            {icons[icon] || icons.id}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeStyles[badge]}`}>
            {value}
          </span>
        )}
      </div>
      <div className="text-gray-900 dark:text-white font-medium truncate">{value || "N/A"}</div>
    </div>
  );
};

// Edit Officer Modal Component
const EditOfficerModal = ({ open, onClose, form, onChange, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Security Officer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update officer information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Officer ID - Read Only */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Officer ID</label>
            <input
              value={form.officerId}
              disabled
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Officer ID cannot be modified</p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={onChange}
                  className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                  {form.isActive ? "Active (Officer can access system)" : "Inactive (Officer cannot access system)"}
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Security;