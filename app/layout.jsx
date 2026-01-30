import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BoundaryProvider } from "./boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SDN 2 GEDOG",
  description: "Home page SDN2 GEDOG",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-x-none`}
      >
        <BoundaryProvider>
          {children}
        </BoundaryProvider>
      </body>
    </html>
  );
}
