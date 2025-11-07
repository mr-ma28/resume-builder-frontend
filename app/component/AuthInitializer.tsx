"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore"; // adjust if needed

export default function AuthInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, initializeFromCookies } = useAuthStore();

  useEffect(() => {
    initializeFromCookies();
  }, [initializeFromCookies]);

  useEffect(() => {
    if (token === undefined) return; // wait for store init

    if (!token && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
    } else if (token && (pathname === "/login" || pathname === "/register")) {
      router.replace("/resumes");
    }
  }, [token, pathname, router]);

  return null; // it doesn't render anything visible
}
