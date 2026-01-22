import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { flaterr, USER_LOGIN } from "@/lib/authschema";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { verifyhashpass } from "@/lib/hashpass";
import { getToken } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {NextResponse}
 */
export async function POST(request) {
    try{
        const rawdata = await request.json();
        const validate = USER_LOGIN.safeParse(rawdata);


        if(!validate.success)
            return NextResponse.json({data:flaterr(validate.error)},{status:st4xx.badRequest});

        const user = await prisma.user.findUniqueOrThrow({
            where:{email:validate.data.email},
            select:{
                id:true,
                role:true,
                password:true
            }
        });

        return await verifyhashpass(validate.data.password, user.password)? 
            NextResponse.json({data: await getToken({id:user.id, role:user.role})},{status:st2xx.ok}):
            NextResponse.json({data: "password salah"},{status:st4xx.notFound});

    }catch(e){
        const knownErr = prismaError(e);
        if(knownErr)
            return knownErr;
        
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}




