import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import komponen Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samudera Komoditas Indonesia",
  description: "Koperasi Pemasaran dan Ekspor Komoditas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Navbar dipanggil di sini agar muncul di semua halaman */}
        <Navbar />

        {children}
      </body>
    </html>
  );
}
