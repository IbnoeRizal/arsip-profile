import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { flaterr, JABATAN_BY_ADMIN, JABATAN_DELETE_BY_ADMIN } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
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

        const jabatans = await Promise.all([
            prisma.jabatan.findMany({
                select:{
                    id:true,
                    title:true,
                },
                take:limit,
                skip:page*limit
            }),
            prisma.jabatan.count()
        ]);

        return NextResponse.json({data:jabatans},{status:st2xx.ok});

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
        const [payload, rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ]);

        requireRole(payload, [Role.ADMIN]);
        const validated = JABATAN_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const jabatan = await prisma.jabatan.create({
            data:validated.data,
            select:{
                id:true,
                title:true,
            }
        })

        return NextResponse.json({data:jabatan},{status:st2xx.created});

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
        const [payload, rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ])
        
        requireRole(payload, [Role.ADMIN]);
        const validated = JABATAN_DELETE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const jabatan = await prisma.jabatan.delete({
            where:{id:validated.data.id},
            select:{
                id:true,
                title:true,
            }
        })

        return NextResponse.json({data:jabatan},{status:st2xx.created});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}
