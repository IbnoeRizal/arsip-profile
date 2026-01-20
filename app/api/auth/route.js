import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function POST(request) {
    console.log(request)
}




