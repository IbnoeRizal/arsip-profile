import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BoundaryProvider } from "@/context/boundary";
import { CredentialProvider } from "@/context/usercredential";
import { getUserFromCookie } from "@/lib/auth";
import { Suspense } from "react";
import Loading from "./loading";
import { Role } from "@/generated/prisma/enums";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-x-none min-h-screen`}
      >
        <Suspense fallback={<Loading/>}>
          <GetCredential>
            {children}
          </GetCredential>
        </Suspense>
      </body>
    </html>
  );
}

async function GetCredential({children}){
  const payload = await getUserFromCookie();
  const list_link = ["/karyawan"];

  if(payload?.role === Role.ADMIN)
    list_link.push("/administrator");
  
  return (
    <CredentialProvider id={payload?.id} role={payload?.role}>
      <BoundaryProvider list_link={list_link}>
        {children}
      </BoundaryProvider>
    </CredentialProvider>
  )
}
