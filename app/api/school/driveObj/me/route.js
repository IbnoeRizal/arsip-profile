import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";


/**
 * 
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload, [Role.ADMIN,Role.USER]);
        const id = payload.id;
        
        const driveObj = await prisma.driveObj.findMany({
            where:{userId:id},
            select:{
                id:true,
                link:true,
                category:true
            }
        });

        return NextResponse.json({data:driveObj},{status:st2xx.ok});
    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}