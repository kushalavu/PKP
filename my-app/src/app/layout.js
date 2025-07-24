// app/layout.js
'use client';

import Sidebar from "@/components/sideBar/SideBar";
import Header from "@/components/sideBar/Header";
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isMinimalRoute = pathname === '/login' || pathname === '/';

  return (
    <html lang="en">
      <body className={`layout-scroll ${poppins.variable}`}>
        {isMinimalRoute ? (
          <main className="p-lg-3 px-1 py-lg-4 py-3">{children}</main>
        ) : (
          <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
              <Header />
              <main className="p-lg-3 px-1 py-lg-4 py-3 whole-src-clr">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
