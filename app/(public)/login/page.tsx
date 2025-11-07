"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, Lock, User, HelpCircle } from "lucide-react";
import axiosClient from "./../../lib/axiosClient";
import { useAuthStore } from "./../../store/useAuthStore";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, initializeFromCookies } = useAuthStore();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  // ✅ Run once on mount: check if already logged in
  useEffect(() => {
    initializeFromCookies();
    const token = Cookies.get("token");
    if (token) {
      router.replace("/resumes");
    }
  }, [router, initializeFromCookies]);

  // ✅ Handle Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "info", text: "Logging in..." });

    try {
      const res = await axiosClient.post("/auth/local", form);
      const { jwt, user } = res.data;

      setToken(jwt);
      setUser(user);

      setMessage({ type: "success", text: `Welcome, ${user.username}! 🎉` });

      setTimeout(() => router.push("/resumes"), 1000);
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorMsg =
        err?.response?.data?.error?.message ||
        "Invalid credentials, please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side - Illustration/Info */}
        <div className="w-full lg:w-1/2 max-w-md text-center lg:text-left">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                <LogIn className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome Back
            </h1>

            <p className="text-gray-600 text-lg lg:text-xl mb-8 leading-relaxed">
              Sign in to your ResumeCraft account and continue building your
              professional resume.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Access your saved resumes</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Quick and secure login</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium">Your data is protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-500">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="identifier"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={form.identifier}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center space-x-1">
                    <HelpCircle size={14} />
                    <span>Forgot Password?</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  message.type === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      message.type === "error"
                        ? "bg-red-500"
                        : message.type === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline">
                  Create one here
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Secure Login</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
