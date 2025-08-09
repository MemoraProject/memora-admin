import "@/styles/globals.css";
import QueryProvider from "@/components/shared/QueryProvider";

import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
