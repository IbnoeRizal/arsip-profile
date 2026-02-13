import prisma from "@/lib/prisma";
import { flaterr, USER_PATCH_BY_ADMIN, USER_PATCH_BY_USER } from "@/lib/authschema";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { NextResponse } from "next/server";
import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { prismaError } from "@/lib/prismaErrorResponse";
import { Role } from "@/generated/prisma/enums";
import { hasherpass } from "@/lib/hashpass";
import { USER_GET_BY_ID } from "@/lib/server_cache/cache_tags_name";

/**
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function PATCH(request) {
    try{
        const [payload, rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ]);
        requireRole(payload,[Role.ADMIN,Role.USER]);

        const id = payload.id;
        
        const validated = payload.role === Role.ADMIN? 
            USER_PATCH_BY_ADMIN.safeParse(rawdata): 
            USER_PATCH_BY_USER.safeParse(rawdata);
    
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

        USER_GET_BY_ID.revalidate();
        return NextResponse.json({data:user},{status:st2xx.ok});
    
    }catch(e){
        const autherr = authError(e);
        if(autherr)
            return autherr;

        console.error(e);
        return prismaError(e)?? NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}