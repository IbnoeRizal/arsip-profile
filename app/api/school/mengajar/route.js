import { Role } from "@/generated/prisma/enums";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { st2xx,st4xx,st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { authError } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";
import { flaterr, MENGAJAR_CREATE_BY_ADMIN, MENGAJAR_DELETE_BY_ADMIN } from "@/lib/authschema";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
    const payload = await getUserFromRequest(request);
    try{
        requireRole(payload, [Role.ADMIN]);
        const {page,limit} = pagination(request);
        
        const mengajar = await Promise.all([
            prisma.mengajar.findMany({
                select:{
                    id:true,
                    kelas:{
                        select:{
                            id:true,
                            nama:true
                        }
                    },

                    mapel:{
                        select:{
                            id:true,
                            nama:true,
                        }
                    },
                    
                    user:{
                        select:{
                            id:true,
                            name:true,
                        }
                    }
                },
                take:limit,
                skip:page*limit
            }),
            prisma.mengajar.count()
        ]);

        return NextResponse.json({data:mengajar},{status:st2xx.ok});
    
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
    try {
        const [rawdata,payload] = await Promise.all([
            request.json(),
            getUserFromRequest(request)
        ]);

        requireRole(payload,[Role.ADMIN]);
        const validated = MENGAJAR_CREATE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mengajar = await prisma.mengajar.create({
            data:validated.data,
            select:{
                id:true,
            }
        });

        return NextResponse.json({data:mengajar},{status:st2xx.created});

    }catch (e) {
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
    try {
        const [rawdata,payload] = await Promise.all([
            request.json(),
            getUserFromRequest(request)
        ]);

        requireRole(payload,[Role.ADMIN]);
        const validated = MENGAJAR_DELETE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mengajar = await prisma.mengajar.delete({
            where:validated.data,
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