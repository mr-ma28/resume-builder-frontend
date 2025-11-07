"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/useAuthStore";

export default function HomePage() {
  const router = useRouter();
  const { initializeFromCookies, token } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initializeFromCookies();

    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (token) {
        // User logged in hai - resumes page pe redirect karo
        router.replace("/resumes");
      } else {
        // User logged in nahi hai - login page pe redirect karo
        router.replace("/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router, initializeFromCookies, token]);

  // Loading spinner show karo
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Loading ResumeCraft
        </h2>
        <p className="text-gray-500">Taking you to the right place...</p>
      </div>
    </div>
  );
}
