import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bahafit - Caribbean Fitness Community",
  description: "Connect with fitness events, gyms, coaches, and wellness centers across the Caribbean",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
