import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import QueryProvider from "@/components/shared/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {/* <h1>USER LAYOUT</h1> */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
