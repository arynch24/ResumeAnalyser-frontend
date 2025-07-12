import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthenticationContext";
import { ContextProvider } from "@/context/DashboardContext";

export const metadata: Metadata = {
  title: "IntelliResume",
  description: "Ai-powered resume builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          <ContextProvider>
            {children}
          </ContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
