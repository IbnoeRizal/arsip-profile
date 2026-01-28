import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { flaterr,MAPEL_CREATE_BY_ADMIN} from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function PATCH(request,context) {
    try{
        const [payload,{id},rawdata] = await Promise.all([ 
            getUserFromRequest(request),
            context.params,
            request.json()
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = MAPEL_CREATE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mapel = await prisma.mapel.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                nama:true,
            },   
        });

        return NextResponse.json({data:mapel},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

