import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';

const EditSecurityOfficer = () => {
  const { officerId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AdminContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [officer, setOfficer] = useState(null);

  // Fetch officer details
  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/officer/${officerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.data.success) {
          setOfficer(res.data.data);
          setFormData({
            fullName: res.data.data.fullName || '',
            email: res.data.data.email || '',
            phone: res.data.data.phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching officer:', error);
        toast.error('Failed to load officer details');
        navigate('/manage-security');
      } finally {
        setLoading(false);
      }
    };

    fetchOfficer();
  }, [officerId, token, backendUrl, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      console.log("Submitting update for officer:", officerId);
      console.log("Form data:", { fullName: formData.fullName, email: formData.email, phone: formData.phone });
      
      const res = await axios.patch(
        `${backendUrl}/api/officer/${officerId}`,
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message || 'Officer updated successfully');
        setTimeout(() => {
          navigate('/manage-security');
        }, 1500);
      } else {
        toast.error(res.data.message || 'Failed to update officer');
      }
    } catch (error) {
      console.error('Error updating officer:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update officer';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading officer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Edit Security Officer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update officer information
          </p>
        </div>
        <button
          onClick={() => navigate('/manage-security')}
          className="inline-flex items-center px-4 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Officer Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {officer?.fullName?.charAt(0) || 'O'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                {officer?.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Security Officer</p>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    ID: {officer?.officerId}
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className={`text-sm font-medium ${officer?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {officer?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {officer?.createdAt ? new Date(officer.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Update Officer Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter full name"
                  disabled={submitting}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter email address"
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter phone number"
                  disabled={submitting}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Officer ID (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Officer ID
                </label>
                <input
                  type="text"
                  value={officer?.officerId || ''}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Officer ID cannot be changed here</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/manage-security')}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSecurityOfficer;
