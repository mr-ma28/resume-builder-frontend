"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail, User, Lock } from "lucide-react";
import axiosClient from "../../lib/axiosClient";
import { useAuthStore } from "../../store/useAuthStore";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  interface Message {
    type: "info" | "success" | "error";
    text: string;
  }

  const [message, setMessage] = useState<Message | null>(null);

  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/resumes");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "info", text: "Creating your account..." });

    try {
      const res = await axiosClient.post("/auth/local/register", form);
      const { jwt, user } = res.data;

      setToken(jwt);
      setUser(user);

      setMessage({ type: "success", text: `Welcome ${user.username}! 🎉` });
      setTimeout(() => router.push("/resumes"), 1000);
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err?.response?.data?.error?.message ||
        "Registration failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 max-h-[85vh]">
        {/* Left Side - Illustration/Info */}
        <div className="w-full lg:w-1/2 max-w-md text-center lg:text-left">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 h-full">
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Join ResumeCraft
            </h1>

            <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
              Create your account and start building professional resumes that
              stand out to employers.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium text-sm">
                  Professional resume templates
                </span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-sm">Easy to use editor</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-700">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-sm">Secure data storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm">
                Join thousands of professionals using ResumeCraft
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-xl border ${
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
                  <p className="font-medium text-sm">{message.text}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline">
                  Sign in here
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-xs">Get Started</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
