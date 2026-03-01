import React, { useState, useContext, useEffect } from 'react';
import { SecurityContext } from '../context/SecurityContext';
import { Link } from 'react-router-dom';

const SecurityProfile = () => {
  const { securityInfo, updateProfile, fetchSecurityProfile } = useContext(SecurityContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  
 
  
  useEffect(() => {
    if (securityInfo) {
      setFormData({
        fullName: securityInfo.fullName || '',
        phone: securityInfo.phone || '',
        officerId: securityInfo.officerId || ''
      });
    }
  }, [securityInfo]);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!securityInfo) {
        console.log("Fetching security profile...");
        try {
          await fetchSecurityProfile();
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };
    
    loadProfile();
  }, []);
  
 

  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.officerId.trim()) {
      newErrors.officerId = 'Officer ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);
    
    
    if (result.success) {
      // Success handled by toast in context
      console.log("Profile updated successfully:", result);
    } else {
      console.error("Profile update failed:", result.error);
    }
  };
  
  if (!securityInfo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            If this takes too long, please refresh the page
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your security officer profile</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/security/change-password"
            className="inline-flex items-center px-4 py-2.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {securityInfo.fullName?.charAt(0) || 'S'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{securityInfo.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Security Officer</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{securityInfo.email}</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    {securityInfo.phone || 'Not provided'}
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    ID: {securityInfo.officerId || 'Not available'}
                  </span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    Status: <span className={`font-medium ${securityInfo.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {securityInfo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile Information</h3>
            
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
                  onChange={(e) => {
    const value = e.target.value;
    // Remove all non-alphabet characters (allow only letters and spaces)
    const cleanedValue = value.replace(/[^a-zA-Z\s]/g, '');
    setFormData(prev => ({ ...prev, fullName: cleanedValue }));
    if (errors.fullName) {
      setErrors(prev => ({ ...prev, fullName: '' }));
    }
  }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your full name"
                  disabled={loading}
                  
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>
                )}
              </div>
              
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={securityInfo.email || 'Loading...'}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const cleanedValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: cleanedValue }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter phone number"
                  disabled={loading}
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>
              
              {/* Officer ID (editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Officer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="officerId"
                  value={formData.officerId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, officerId: e.target.value }));
                    if (errors.officerId) {
                      setErrors(prev => ({ ...prev, officerId: '' }));
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                    errors.officerId ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your officer ID"
                  disabled={loading}
                />
                {errors.officerId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.officerId}</p>
                )}
              </div>
              
              {/* Account Status (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                <div className={`px-4 py-3 rounded-xl border ${
                  securityInfo.isActive 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                }`}>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                        securityInfo.isActive 
                          ? "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                      } />
                    </svg>
                    {securityInfo.isActive ? 'Your account is active' : 'Your account is inactive'}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {securityInfo.isActive 
                    ? 'You have full access to the security portal'
                    : 'Contact administrator to activate your account'
                  }
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !securityInfo}
                  className="w-full py-3.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating Profile...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityProfile;