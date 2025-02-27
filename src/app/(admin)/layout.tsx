"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken || adminToken.trim() === "") {
      localStorage.removeItem("adminToken");
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </body>
    </html>
  );
}
