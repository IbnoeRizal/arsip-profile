import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { pagination } from "@/lib/pagination";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { prismaError } from "@/lib/prismaErrorResponse";
import { requireRole, getUserFromRequest, authError } from "@/lib/auth";
import { Role } from "@prisma/client";
import { flaterr, USER_CREATE_BY_ADMIN, USER_DELETE_BY_ADMIN } from "@/lib/authschema";
import { hasherpass } from "@/lib/hashpass";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
    const {page,limit} = pagination(request);

    try{
        const [users,total] = await Promise.all([
            prisma.user.findMany({
                select:{
                    id:true,
                    name:true,
                    jabatan:{
                        select:{
                            title:true
                        }
                    }
                },
                take: limit,
                skip: page * limit
            }),
            prisma.user.count()
        ]);

        return NextResponse.json({data:[users,total]},{status:st2xx.ok});

    }
    catch(e){
        console.error(e);
        return prismaError(e) ?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
    const payload = await getUserFromRequest(request);
    
    try{
        requireRole(payload,[Role.ADMIN]);
        const rawdata = await request.json();
        const verivied = USER_CREATE_BY_ADMIN.safeParse(rawdata);

        if(!verivied.success)
            return NextResponse.json({data:flaterr(verivied.error)},{status:st4xx.badRequest});

        const datahashed = {...verivied.data};

        
        datahashed.password = await hasherpass(datahashed.password);

        const user = await prisma.user.create({
            data:datahashed,
            select:{
                id:true,
                name:true,
                jabatan:{
                    select:{
                        title:true
                    }
                },
            }
        });

        return NextResponse.json({data:user},{status:st2xx.created});
    }catch(e){
        const autherr = authError(e);
        if(autherr)
            return autherr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request) {
    const payload = await getUserFromRequest(request);

    try{
        requireRole(payload,[Role.ADMIN]);
        const rawdata = await request.json();
        const validated = USER_DELETE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const user = prisma.user.delete({
            where: validated.data,
            select:{
                id:true
            }
        });

        return NextResponse.json({data:user},{status:st2xx.ok});

    }catch(e){
        const autErr = authError(e);
        if (autErr)
            return autErr;
        
        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}