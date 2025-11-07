"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, HelpCircle } from "lucide-react";
import axiosClient from "./../../lib/axiosClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "info", text: "Sending reset instructions..." });

    try {
      // Strapi forgot password endpoint
      await axiosClient.post("/send-email", {
        to: email,
        subject: "Password Reset Instructions",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL}/reset-password/?email=${email}" 
             style="color:#2563eb;text-decoration:underline;">
             Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
        `,
      });

      setMessage({
        type: "success",
        text: "Password reset instructions sent! Check your email including spam folder. 📧",
      });

      // Clear form on success
      setEmail("");
    } catch (err: any) {
      console.error("Forgot Password Error:", err);

      let errorMsg = "Failed to send reset instructions. ";

      if (err.response?.status === 400) {
        errorMsg += "Email not found or invalid.";
      } else if (err.response?.status === 500) {
        errorMsg += "Server error. Please try again later.";
      } else if (err.response?.data?.error?.message) {
        errorMsg += err.response.data.error.message;
      } else {
        errorMsg += "Please check your email and try again.";
      }

      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-500">
              Enter your email address and we'll send you reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="email"
                  placeholder="Enter your registered email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                />
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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail size={20} />
                  <span>Send Reset Instructions</span>
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

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 hover:underline">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <strong>Note:</strong> The reset link will expire in 1 hour for
              security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
