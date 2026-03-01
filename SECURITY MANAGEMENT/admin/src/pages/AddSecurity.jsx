import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const AddSecurity = () => {
  const { navigate, fetchOfficers, token, backendUrl } = useContext(AdminContext)
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    officerId: "",
    fullName: "",
    email: "",
    phone: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e?.preventDefault();
      
      if (!form.officerId.trim()) return setError("Officer ID is required.")
    
    if (!form.fullName.trim()) return setError("Full Name is required.");
    if (!form.email.trim()) return setError("Email Address is required.")
    
    if (!form.phone.trim()) return setError("Phone is required.");

    try {
      const response = await axios.post(
        backendUrl + "/api/officer/add", 
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Security officer added successfully");
      setForm({ officerId: "", fullName: "", email: "", phone: "" });
      setError("");
      
      await fetchOfficers();
      navigate("/manage-security-officer");

    } catch (err) {
        const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add security officer";
        
      toast.error(message);
      setError(message);
    }
  };

 return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add Security Officer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Register new security personnel</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Security Access
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Officer ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Officer ID <span className="text-red-500">*</span>
              </label>
              <input
                name="officerId"
                placeholder="SEC001"
                value={form.officerId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Unique identifier for the officer (e.g., SEC001)</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
                placeholder="officer@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                placeholder="0987654321"
                type="tel"
                value={form.phone}
                onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 10) value = value.slice(0, 10);
                      setForm((f) => ({ ...f, phone: value }));
                    }
                    }
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                maxLength={10}
              />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Login Credentials</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Officers will login using their Email and Officer ID</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="w-full py-3.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                Add Security Officer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSecurity;
