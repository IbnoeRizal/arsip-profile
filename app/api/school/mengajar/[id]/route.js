import { Role } from "@/generated/prisma/enums";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { st2xx,st4xx,st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { authError } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";
import { flaterr, MENGAJAR_UPDATE_BY_ADMIN } from "@/lib/authschema";


/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function POST(request,context) {
    try {
        const [rawdata,{id},payload] = await Promise.all([
            request.json(),
            context.params,
            getUserFromRequest(request)
        ]);

        requireRole(payload,[Role.ADMIN]);
        const validated = MENGAJAR_UPDATE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mengajar = await prisma.mengajar.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
            }
        });

        return NextResponse.json({data:mengajar},{status:st2xx.ok});

    }catch (e) {
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});   
    }
}