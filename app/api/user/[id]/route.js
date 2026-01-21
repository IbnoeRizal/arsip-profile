import prisma from "@/lib/prisma";
import { flaterr, USER_PATCH_BY_ADMIN, USER_PATCH_BY_USER } from "@/lib/authschema";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";
import { Role } from "@prisma/client";
import { hasherpass } from "@/lib/hashpass";


/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:{id:string}}} context 
 * @returns {NextResponse}
 */
export async function GET(request,context) {
    const {id} = await context.params
    try{
        const user = await prisma.user.findUniqueOrThrow({
            where:{id},
            select:{
                name:true,
                email:true,
                bio:true,
                jabatan:{
                    select:{
                        title:true,   
                    }
                },
                mengajar:{
                    select:{
                        kelas:{
                            select:{
                                nama:true
                            },
                        },
                        mapel:{
                            select:{
                                nama:true
                            }
                        }
                    }
                },
            }
        });
        return NextResponse.json({data:user, err:null},{status:st2xx.ok});
    }catch(e){
        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }

}

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:{id:string}}} context 
 * @returns {NextResponse}
 */
export async function PATCH(request,context) {
    try{
        const [payload,{id},rawdata] = await Promise.all([
            getUserFromRequest(request),
            context.params,
            request.json()
        ]);

        requireRole(payload,[Role.ADMIN]);

        const validated = USER_PATCH_BY_ADMIN.safeParse(rawdata);
    
        if(!validated.success)
            return NextResponse.json({data:flaterr(validated.error)},{status:st4xx.badRequest});

        const datahashed = {...validated.data};
        
        if(datahashed.password){
            datahashed.password = await hasherpass(datahashed.password);
        }
        

        const user = await prisma.user.update({
            where:{
                id:id
            },
            data:datahashed,
            select:{
                name:true,
                email:true,
                bio:true,
                jabatan:{
                    select:{
                        title:true,   
                    }
                },
                mengajar:{
                    select:{
                        kelas:{
                            select:{
                                nama:true
                            },
                        },
                        mapel:{
                            select:{
                                nama:true
                            }
                        }
                    }
                },
            }
        })

        return NextResponse.json({data:user},{status:st2xx.ok});
    
    }catch(e){
        const autherr = authError(e);
        if(autherr)
            return autherr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}