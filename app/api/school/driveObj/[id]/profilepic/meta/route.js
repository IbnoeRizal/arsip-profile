import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { PROFLE_PIC } from "@/lib/server_cache/cache_tags_name";
import { NextResponse } from "next/server";

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context 
 * @returns {NextResponse}
 */
export async function GET(request,context){
    const {id} = await context.params;
    try {
        const profile = await PROFLE_PIC.getProfilePic(id);
        if(!profile)
            return NextResponse.json({data:"Not found"},{status:st4xx.notFound});

        return NextResponse.json({data:profile.id},{status:st2xx.ok});        
    } catch (e) {
        const knownErr = prismaError(e);
        if (knownErr) return knownErr;

        console.error(e);

        return new NextResponse("Internal Server Error", {
            status: st5xx.internalServerError,
        });
    }
}
