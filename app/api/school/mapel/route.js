import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { flaterr, MAPEL_CREATE_BY_ADMIN, MAPEL_DELETE_BY_ADMIN } from "@/lib/authschema";
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
        const {page,limit} =  pagination(request);
        const where = filterQuery(request,Prisma.ModelName.Mapel);

        const mapels = await Promise.all([
            prisma.mapel.findMany({
                select:{
                    id:true,
                    nama:true
                },
                orderBy:{
                    nama:"asc"
                },
                take:limit,
                skip:limit*page,
                where
            }),
            prisma.kelas.count({where})
        ]);

        return NextResponse.json({data:mapels},{status:st2xx.ok});

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
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = MAPEL_CREATE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mapel = await prisma.mapel.create({
            data:validated.data,
            select:{
                id:true,
                nama:true,
            },   
        });

        return NextResponse.json({data:mapel},{status:st2xx.created});

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
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = MAPEL_DELETE_BY_ADMIN.safeParse(rawdata);
        
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const mapel = await prisma.mapel.delete({
            where:{id:validated.data.id},
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