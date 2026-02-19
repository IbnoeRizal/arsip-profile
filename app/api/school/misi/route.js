import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { MISI_CREATE_BY_ADMIN, MISI_DELETE_BY_ADMIN } from "@/lib/authschema";
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
        const {page,limit} = pagination(request);
        const where = filterQuery(request,Prisma.ModelName.Misi);

        const misions = await Promise.all([
            prisma.misi.findMany({
                select:{
                    id:true,
                    order:true,
                    mision:true,
                    visi:{
                        select:{
                            vision:true,
                        }
                    }
                },
                orderBy:{
                    order:"asc"
                },
                take:limit,
                skip:page*limit,
                where
            }),
            prisma.misi.count({where})
        ]);

        return NextResponse.json({data:misions},{status:st2xx.ok});
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

        const validated = MISI_CREATE_BY_ADMIN.safeParse(rawdata);
        if(!validated.success){
            console.table(validated.error)
            return NextResponse.json({data:validated.error},{status:st4xx.badRequest});
        }

        const misions = await prisma.misi.create({
            data:validated.data,
        });

        return NextResponse.json({data:`${misions.mision} berhasil dibuat`},{status:st2xx.created});       
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

        const validated = MISI_DELETE_BY_ADMIN.safeParse(rawdata);
        if(!validated.success)
            return NextResponse.json({data:validated.error},{status:st4xx.badRequest});

        const misions = await prisma.misi.deleteMany({
            where:{
                idVisi:validated.data.idVisi
            }
        });

        return NextResponse({data:`${misions} record berhasil dihapus`},{status:st2xx.ok});       
    }catch(e){
        const knownErr = authError(e)??prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }    
}
