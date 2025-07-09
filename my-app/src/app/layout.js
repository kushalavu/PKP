import Sidebar from "@/components/sideBar/SideBar";
import Header from "@/components/sideBar/Header";
import { Poppins } from 'next/font/google';

// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins', // optional: to use as CSS variable
  display: 'swap',
});



export const metadata = {
  title: "PKP",
  description: "Production Analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <body className={`${poppins.variable}`} style={{ height: '100vh', overflow: 'hidden' }}>
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <Header />
            <main className="p-4 whole-src-clr">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
