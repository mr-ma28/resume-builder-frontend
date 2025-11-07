import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./component/header"; // agar tumhare pass header component hai

export const metadata = {
  title: "Your App Name",
  description: "Your App Description",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header /> {/* ye har page par dikhega except login page */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
