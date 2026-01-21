import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_UPDATE_BY_ADMIN, flaterr } from "@/lib/authschema";
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
    const payload = await getUserFromRequest(request);
    const {id} = await context.params

    try{
        requireRole(payload,[Role.ADMIN]);
        const rawdata = await request.json();
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

        return NextResponse.json({data:driveObj},{status:st2xx.ok});

    }catch(e){
        const autErr = authError(e);
        if(autErr)
            return autErr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}