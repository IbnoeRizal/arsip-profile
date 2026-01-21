import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_CREATE_BY_ADMIN, DRIVEOBJ_DELETE_BY_ADMIN, flaterr } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request
 * @returns {NextResponse}
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload, [Role.ADMIN]);
        const {page,limit} = pagination(request);

        const [driveObj, total] = await Promise.all([
            prisma.driveObj.findMany({
                select:{
                    id:true,
                    link:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                        }
                    }
                },
                take:limit,
                skip:page * limit
            }),
            prisma.driveObj.count()
        ]);

        return NextResponse.json({data:[driveObj,total]},{status:st2xx.ok});
    }catch(e){
        const autErr = authError(e);
        if (autErr)
            return autErr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function POST(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.ADMIN]);
        const rawdata = await request.json();
        const validated = DRIVEOBJ_CREATE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.create({
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

        return NextResponse.json({data:driveObj},{status:st2xx.created});

    }catch(e){
        const autErr = authError(e);
        if(autErr)
            return autErr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function DELETE(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.ADMIN]);
        const rawdata = await request.json();
        const validated = DRIVEOBJ_DELETE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.delete({
            where:{id:validated.data.id},
            select:{
                id:true,
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