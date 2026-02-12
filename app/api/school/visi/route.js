import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { VISI_CREATE_BY_ADMIN, VISI_DELETE_BY_ADMIN } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<NextResponse>} 
 */
export async function GET(request) {
    try{
        const {page,limit} = pagination(request);
        const visions = await Promise.all([
            prisma.visi.findMany({
                select:{
                    id:true,
                    vision:true
                },
                take:limit,
                skip:page*limit
            }),
            prisma.visi.count()
        ]);

        return NextResponse.json({data:visions},{status:st2xx.ok});
    }catch(e){
        const knownErr = prismaError(e);
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

        const validated = VISI_CREATE_BY_ADMIN.safeParse(rawdata);
        if(!validated.success)
            return NextResponse.json({data:validated.error},{status:st4xx.badRequest});

        const visi = await prisma.visi.create({
            data:validated.data,
            select:{
                id:true,
                vision:true,
            }
        });

        return NextResponse.json({data:visi},{status:st2xx.created});       
    }catch(e){
        const knownErr = authError(e)??prismaError(e);
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

        const validated = VISI_DELETE_BY_ADMIN.safeParse(rawdata);
        if(!validated.success)
            return NextResponse.json({data:validated.error},{status:st4xx.badRequest});

        const visi = await prisma.visi.delete({
            where:{
                id:validated.data.id
            },
            select:{
                id:true,
                vision:true,
            }
        });

        return NextResponse.json({data:visi},{status:st2xx.ok});       
    }catch(e){
        const knownErr = authError(e)??prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }    
}
