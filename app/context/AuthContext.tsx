"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  login: (userData: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Check login status from localStorage
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (userData: { id: string; name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
