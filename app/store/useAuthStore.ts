"use client";
import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  initializeFromCookies: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  // ✅ Save user both in state & cookie
  setUser: (user) => {
    set({ user });
    if (user) Cookies.set("user", JSON.stringify(user), { expires: 7 });
    else Cookies.remove("user");
  },

  // ✅ Save token both in state & cookie
  setToken: (token) => {
    set({ token });
    if (token) Cookies.set("token", token, { expires: 7 });
    else Cookies.remove("token");
  },

  // ✅ Logout clears everything
  logout: () => {
    Cookies.remove("user");
    Cookies.remove("token");
    set({ user: null, token: null });
  },

  // ✅ Initialize from cookies (auto login restore)
  initializeFromCookies: () => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({ token, user });
      } catch (e) {
        console.error("Error parsing user from cookies:", e);
      }
    }
  },
}));
