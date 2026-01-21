import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { flaterr, JABATAN_BY_ADMIN } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:{id:string}}} context
 * @returns {NextResponse}
 */
export async function PATCH(request,context) {
    try{
        const [payload,{id},rawdata] = await Promise.all([
            getUserFromRequest(request),
            context.params,
            request.json()
        ])

        requireRole(payload, [Role.ADMIN]);
        const validated = JABATAN_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const jabatan = await prisma.jabatan.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                title:true,
            }
        })

        return NextResponse.json({data:jabatan},{status:st2xx.created});

    }catch(e){
        const autErr = authError(e);
        if(autErr)
            return autErr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}


