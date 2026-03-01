import React, { useState, useContext } from 'react';
import { SecurityContext } from '../context/SecurityContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SecurityChangePassword = () => {
  const { backendUrl, token } = useContext(SecurityContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
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
  
  try {
    

    console.log(token);
    
    if (!token) {
      alert('No authentication token found. Please login again.');
      navigate('/login');
      return;
    }

    const response = await axios.patch(
      `${backendUrl}/api/officer/change-password`,
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      },
      {
        headers: { 
          token
        }
      }
    );

    // Check the response data structure
    if (response.data && response.data.success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message
      toast.success(response.data.message);
      
      // Navigate to dashboard
      navigate('/security-dashboard');
    } else {
      // Handle case where response.success is false
      toast.error(response.data?.message || 'Password change failed');
      setLoading(false);
    }
    
  } catch (error) {
    setLoading(false);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const errorMsg = error.response.data?.message || 
                       `Error: ${error.response.status} ${error.response.statusText}`;
      toast.error(errorMsg);
      
      // Handle token expiration
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else if (error.request) {
      // Request was made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Other errors
      toast.error('An error occurred: ' + error.message);
    }
  }
};
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Change Password</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update your security account password</p>
        </div>
        <button
          onClick={() => navigate('/security-dashboard')}
          className="inline-flex items-center px-4 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      
      {/* Password Change Form */}
      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter current password"
                disabled={loading}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword}</p>
              )}
            </div>
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter new password (min. 6 characters)"
                disabled={loading}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Confirm new password"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Password Requirements */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.newPassword.length > 0 ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Password provided
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.newPassword !== formData.currentPassword && formData.newPassword ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Different from current password
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Passwords match
                </li>
              </ul>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Changing Password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Security Tips</h3>
              <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Use a strong, unique password</li>
                <li>• Don't reuse passwords from other sites</li>
                <li>• Consider using a password manager</li>
                <li>• Change your password regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityChangePassword;