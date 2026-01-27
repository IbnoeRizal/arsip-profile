import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { flaterr, USER_LOGIN } from "@/lib/authschema";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { verifyhashpass } from "@/lib/hashpass";
import { getToken,cookie_name } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";

/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
    try{
        const rawdata = await request.json();
        const validate = USER_LOGIN.safeParse(rawdata);


        if(!validate.success)
            return NextResponse.json({data:flaterr(validate.error)},{status:st4xx.badRequest});

        const user = await prisma.user.findUnique({
            where:{email:validate.data.email},
            select:{
                id:true,
                role:true,
                password:true
            }
        });

        if(!user)
            return NextResponse.json({data: "email atau password salah"},{status:st4xx.unauthorized});

        const verified = await verifyhashpass(validate.data.password, user.password);
        
        if(!verified)
            return NextResponse.json({data: "email atau password salah"},{status:st4xx.unauthorized});
        

        const res = NextResponse.json({data:"login success"},{status:st2xx.ok})
        const {token,maxAge} = await getToken({id:user.id, role:user.role},1)
        res.cookies.set({
            name:cookie_name,
            value: token,
            maxAge: maxAge,
            path: "/",
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });

        return res;
        
    }catch(e){
        const knownErr = prismaError(e);
        if(knownErr)
            return knownErr;
        
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}




