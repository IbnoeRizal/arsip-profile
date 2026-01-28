import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { DRIVEOBJ_UPDATE_BY_ADMIN, flaterr } from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getProfilePic = unstable_cache(
    async (id) => {
        return prisma.driveObj.findFirst({
            select: { link:true },
            where: {
                userId: id,
                category: "POFILEPIC",
            },
        });
    },
    ["profile-pic"],
    { revalidate: 360 }
);

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request,context){
    try{
        const {id} = await context.params;
        const profilepic = await getProfilePic(id);

        return NextResponse.json(
            {data:profilepic?.link??""},
            {
                status:st2xx.ok,
                headers:{
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
                }
            });
    }catch(e){
        const knownErr = prismaError(e);
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
export async function PATCH(request,context) {
    try{
        const [payload,{id},rawdata] = await Promise.all([
            getUserFromRequest(request),
            context.params,
            request.json()
        ]);

        requireRole(payload,[Role.ADMIN]);
        const validated = DRIVEOBJ_UPDATE_BY_ADMIN.safeParse(rawdata);

        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const driveObj = await prisma.driveObj.update({
            where:{id},
            data:validated.data,
            select:{
                id:true,
                link:true,
                user:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        });

        return NextResponse.json({data:driveObj},{status:st2xx.ok});

    }catch(e){
        const knownErr = authError(e)?? prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}