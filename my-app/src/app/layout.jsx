
'use client';

import Sidebar from "@/components/sideBar/Sidebar";
import Header from "@/components/sideBar/Header";
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  const [role, setRole] = useState(null);
  const pathname = usePathname();
  useEffect(() => {
    const cookieRole = Cookies.get('userRole');
    if (cookieRole) {
      setRole(cookieRole);
      console.log('User role from cookie:', cookieRole);
    } else {
      console.warn('No role cookie found');
    }
  }, []);
  const isMinimalRoute = pathname === '/login' || pathname === '/';
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <html lang="en">
      <body className={`layout-scroll ${poppins.variable}`}>
        {isMinimalRoute ? (
          <main className="">{children}</main>
        ) : (
          <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
              <Header />
              {role && (
                <main
                  className='p-lg-3 px-1 py-lg-4 py-3 whole-src-clr'
                >
                  {children}
                </main>
              )}


            </div>
          </div>
        )}
      </body>
    </html>
  );
}
