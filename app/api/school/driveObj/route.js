import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_CREATE, DRIVEOBJ_DELETE, flaterr } from "@/lib/authschema";
import { PROFLE_PIC } from "@/lib/server_cache/cache_tags_name";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { filterQuery } from "@/lib/filterQuery";
import { Prisma } from "@/generated/prisma/browser";

/**
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
    try{
        const [payload,{page,limit},where] = await Promise.all([
            getUserFromRequest(request),
            pagination(request),
            filterQuery(request,Prisma.ModelName.DriveObj)
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
                skip:page * limit,
                where
            }),
            prisma.driveObj.count({where})
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

        requireRole(payload,[Role.ADMIN, Role.USER]);
        const validated = DRIVEOBJ_CREATE.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const filter = {...validated.data};

        if(payload.role === Role.USER){
            filter.userId = payload.id;
        }

        const driveObj = await prisma.driveObj.create({
            data:filter,
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

        requireRole(payload,[Role.ADMIN,Role.USER]);
        const validated = DRIVEOBJ_DELETE.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.delete({
            where:{
                id:validated.data.id,
                userId: payload.role === Role.USER ? payload.id : undefined,
            },
            select:{
                id:true,
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