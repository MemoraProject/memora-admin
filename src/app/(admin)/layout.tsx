import "@/styles/globals.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </body>
    </html>
  );
}
