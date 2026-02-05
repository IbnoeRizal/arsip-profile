//@ts-check
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getProfilePic = unstable_cache(
    async (id) => {
        return prisma.driveObj.findFirst({
            select: { 
                id: true,
                link:true,
            },
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
            {data:{id:profilepic?.id ?? "", link:profilepic?.link ?? ""}},
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
