import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BoundaryProvider } from "@/context/boundary";
import { CredentialProvider } from "@/context/usercredential";
import { getUserFromCookie } from "@/lib/auth";
import { Suspense } from "react";
import Loading from "./loading";

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

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-x-none`}
      >
        <BoundaryProvider>
          <Suspense fallback={<Loading/>}>
            <GetCredential>
            {children}
            </GetCredential>
          </Suspense>
        </BoundaryProvider>
      </body>
    </html>
  );
}

async function GetCredential({children}){
  const payload = await getUserFromCookie();
  return (
    <CredentialProvider id={payload?.id} role={payload?.role}>
      {children}
    </CredentialProvider>
  )
}
