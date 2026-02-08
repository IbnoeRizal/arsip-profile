"use server"
import { getUserFromCookie } from "@/lib/auth";
import { redirect, RedirectType, } from "next/navigation";
import { Role } from "@/generated/prisma/enums";

export default async function AdministratorLayout({ children }) {
    const payload = await getUserFromCookie();
    if (!payload || payload.role !== Role.ADMIN)
        redirect("/",RedirectType.replace);

    return (
        <>
            {children}
        </>
    )
}