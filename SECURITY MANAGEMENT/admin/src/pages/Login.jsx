import { useContext, useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const Login = ({ setToken }) => {
  const { navigate } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

  
    if (!email.trim()) { setLoading(false)
      return setError("Email Address is required.")
    }
    if (!password.trim()) { 
      setLoading(false)
       return setError("Password is required.");
    }

    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      console.log(response.data);
      

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful");
        navigate("/")
      } else {
        toast.error("Invalid Credentials");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Security Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Device Access System</h1>
          <p className="text-gray-400">Secure Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Admin Login</h2>
              <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full px-4 py-3 pl-11 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur-sm"
                    type="email"
                    placeholder="admin@example.com"
                    disabled={loading}
                  />
                  <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full px-4 py-3 pl-11 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors backdrop-blur-sm"
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-cyan-600 focus:ring-cyan-500"
                    disabled={loading}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors">
                  Forgot password?
                </a>
              </div> */}


            

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
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

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure connection • All data is encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Device Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};;


export default Login