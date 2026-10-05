import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
});

export const metadata = {
  title: "Smart Monitoring System",
  description: "A smart monitoring system for efficient management and control of various processes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}