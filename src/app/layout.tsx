import type { Metadata } from "next";
import { Lato, Roboto } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
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
    <html lang="en" className="dark">
      <body className={`${lato.variable} ${roboto.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
