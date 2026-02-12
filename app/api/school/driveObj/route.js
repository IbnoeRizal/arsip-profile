import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_CREATE_BY_ADMIN, DRIVEOBJ_DELETE_BY_ADMIN, flaterr } from "@/lib/authschema";
import { profile_pic } from "@/lib/cache_tags_name";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
    try{
        const [payload,{page,limit}] = await Promise.all([
            getUserFromRequest(request),
            pagination(request)
        ]);
        
        requireRole(payload, [Role.ADMIN]);

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
                    },
                    category:true
                },
                take:limit,
                skip:page * limit
            }),
            prisma.driveObj.count()
        ]);

        return NextResponse.json({data:[driveObj,total]},{status:st2xx.ok});
    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
    try{
        const [payload,rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ])

        requireRole(payload,[Role.ADMIN]);
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
                },
                category:true
            }
        });

        return NextResponse.json({data:driveObj},{status:st2xx.created});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request) {
    try{
        const [payload,rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ])

        requireRole(payload,[Role.ADMIN]);
        const validated = DRIVEOBJ_DELETE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.delete({
            where:{id:validated.data.id},
            select:{
                id:true,
            }
        });

        revalidateTag(profile_pic,"max");
        return NextResponse.json({data:driveObj},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}