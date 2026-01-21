import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { flaterr, KELAS_CREATE_BY_ADMIN, KELAS_DELETE_BY_ADMIN } from "@/lib/authschema";
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
    try{
        const [payload,{page,limit}] = await Promise.all([ 
            getUserFromRequest(request),
            pagination(request)
        ]);
        
        requireRole(payload, [Role.ADMIN]);

        const kelass = await Promise.all([
            prisma.kelas.findMany({
                select:{
                    id:true,
                    nama:true,
                },
                orderBy:{
                    nama:"asc"
                },
                take:limit,
                skip:limit*page
            }),
            prisma.kelas.count()
        ]);

        return NextResponse.json({data:kelass},{status:st2xx.ok});

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
export async function POST(request) {
    try{
        const [payload,rawdata] = await Promise.all([ 
            getUserFromRequest(request),
            request.json()
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = KELAS_CREATE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const kelas = await prisma.kelas.create({
            data:validated.data,
            select:{
                id:true,
                nama:true,
            },   
        });

        return NextResponse.json({data:kelas},{status:st2xx.created});

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
    try{
        
        const [payload,rawdata] = await Promise.all([ 
            getUserFromRequest(request),
            request.json()
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = KELAS_DELETE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const kelas = await prisma.kelas.delete({
            where:{id:validated.data.id},
            select:{
                id:true,
                nama:true,
            },   
        });

        return NextResponse.json({data:kelas},{status:st2xx.ok});

    }catch(e){
        const autErr = authError(e);
        if(autErr)
            return autErr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}