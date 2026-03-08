import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_UPDATE, flaterr } from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { PROFLE_PIC } from "@/lib/server_cache/cache_tags_name";
/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function PATCH(request,context) {
    try{
        const [payload,{id},rawdata] = await Promise.all([
            getUserFromRequest(request),
            context.params,
            request.json()
        ]);

        requireRole(payload,[Role.ADMIN, Role.USER]);
        if(payload.role === Role.USER){
            const isowned = await prisma.driveObj.findFirst({
                where:{
                    id,
                    userId: payload.id
                },
            });

            if(!isowned)
                return NextResponse.json({data:"FORBIDDEN"},{status:st4xx.forbidden});

        }
        const validated = DRIVEOBJ_UPDATE.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                link:true,
                name:true,
                user:{
                    select:{
                        id:true,
                        name:true
                    }
                },
            }
        });

        PROFLE_PIC.revalidate(id);
        return NextResponse.json({data:driveObj},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request,context) {

    async function getResource(id){
        return NextResponse.redirect(`https://drive.google.com/file/d/${id}/preview`)
    }
    try{
        const [payload,{id}] = await Promise.all([
            getUserFromRequest(request),
            context.params
        ])

        requireRole(payload,[Role.ADMIN,Role.USER]);
        
        const driveObj = await prisma.driveObj.findFirst({
            where:{id},
            select:{
                id : true,
                userId: true,
                link: true,
            }
        });
        
        if(driveObj.userId !== payload.id) return NextResponse.json({data:"Forbidden"},{status:st4xx.forbidden});

        const arr = driveObj.link.split('/');
        const d_idx = arr.findIndex((val)=>val==="d");

        if(d_idx){
            return await getResource(arr[d_idx+1]);
        }

        const url = URL.parse(driveObj.link);
        const ideas = url.searchParams.get("id");

        if(!ideas){
            return NextResponse.json({data:"notFound"},{status:st4xx.notFound});
        }

        return await getResource(ideas);

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}