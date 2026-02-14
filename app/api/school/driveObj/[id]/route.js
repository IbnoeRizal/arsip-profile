import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_UPDATE_BY_ADMIN, flaterr } from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { PROFLE_PIC } from "@/lib/server_cache/cache_tags_name";
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

        requireRole(payload,[Role.ADMIN, Role.USER]);
        if(payload.role === Role.USER){
            const isowned = prisma.driveObj.findFirst({
                where:{
                    id,
                    userId: payload.id
                },
            });

            if(!isowned)
                return NextResponse.json({data:"FORBIDDEN"},{status:st4xx.forbidden});

        }
        const validated = DRIVEOBJ_UPDATE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                link:true,
                user:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        });

        PROFLE_PIC.revalidate();
        return NextResponse.json({data:driveObj},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}