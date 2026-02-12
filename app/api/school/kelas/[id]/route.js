import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { KELAS_CREATE_BY_ADMIN } from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { st2xx, st4xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
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
        const validated = KELAS_CREATE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:validated.error},{status:st4xx.badRequest});
        
        const kelas = prisma.kelas.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                nama:true
            }
        });

        return NextResponse.json({data:kelas},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}