
// import "./globals.css";
// import QueryProvider from "@/providers/query-provider";
// import { Inter } from "next/font/google";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });

// export const metadata = {
//   title: "Smart Monitoring System",
//   description:
//     "A smart monitoring system for efficient management and control of various processes.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.variable} font-sans antialiased`}>
//         <QueryProvider>{children}</QueryProvider>
//       </body>
//     </html>
//   );
// }





















import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Smart Monitoring System",
  description:
    "A smart monitoring system for efficient management and control of various processes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          This script runs BEFORE the first paint — synchronously.
          It reads localStorage and applies the 'dark' class to <html>
          instantly, so there is zero flash regardless of which page loads.
          The key 'theme' matches exactly what ThemeToggle uses.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}