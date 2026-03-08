import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { SERVER_BLOG_CREATE, MISI_CREATE_BY_ADMIN, MISI_DELETE_BY_ADMIN, CLIENT_BLOG_CREATE, BLOG_DELETE, flaterr } from "@/lib/authschema";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/browser";
import { handleUpload } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { filterQuery } from "@/lib/filterQuery";

const CALLBACK_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL}`;


/**
 * @param {import("next/server").NextRequest} request 
 * @returns {Promise<NextResponse>} 
 */
export async function GET(request) {
    try {
        const {page,limit} = pagination(request);
        const where = filterQuery(request, Prisma.ModelName.Blog);

        const blog = await Promise.all([
            prisma.blog.findMany({
                select:{
                    id:true,
                    kelas:{
                        select:{nama:true}
                    },
                    mapel:{
                        select:{nama:true}
                    },
                    user:{
                        select:{name:true}
                    },
                    nama:true,
                    eTag:true,
                },
                take:limit,
                skip:page*limit,
                where
            }),
            prisma.blog.count({where})
        ]);

        return NextResponse.json({data:blog},{status:st2xx.ok});                

    } catch (e) {
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
export async function POST(request) {
    try{
        const [payload,body] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ]);


        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async(pathname,clientPayload)=>{
                requireRole(payload,[Role.ADMIN,Role.USER]);

                const newPayload = CLIENT_BLOG_CREATE.parse({
                    nama:"draft",
                    ...(JSON.parse(clientPayload)),
                    idUser:payload.id
                });

                return{
                    allowedContentTypes:["text/markdown"],
                    addRandomSuffix: true,
                    tokenPayload:JSON.stringify(newPayload),
                    callbackUrl:`${CALLBACK_BASE_URL}/api/school/post`,
                }
            },
            onUploadCompleted: async ({blob,tokenPayload})=>{

                const tokenPayloadObj = JSON.parse(tokenPayload);

                const data = SERVER_BLOG_CREATE.parse({
                    ...tokenPayloadObj,
                    link:blob.url,
                    eTag:blob.etag,
                    nama:blob.pathname
                });

                await prisma.blog.create({
                    data
                })
            }

        })
        

        return NextResponse.json(jsonResponse);       
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
    try {
        const [payload,rawdata] = await Promise.all([
            getUserFromRequest(request),
            request.json()
        ]);

        requireRole(payload,[Role.ADMIN, Role.USER]);

        const verified = BLOG_DELETE.safeParse(rawdata);

        if(!verified.success)
            return NextResponse.json({data:flaterr(verified.error)},{status:st4xx.badRequest});

        const blogdata = await prisma.blog.findFirst({
            where:{
                id : verified.data.id,
                idUser: payload.id
            },
            select:{
                link: true,
            }
        });

        if(payload.role !== Role.ADMIN && !blogdata)
            return NextResponse.json({data:"forbidden"},{status:st4xx.forbidden});

        del(blogdata.link,{
            ifMatch:verified.data.eTag
        });

        await prisma.blog.delete({
            where:{
                id:verified.data.id
            },
        });

        return NextResponse.json({data:"blog deleted"},{status:st2xx.ok});

        
    } catch (err) {
        const knownErr = authError(e)??prismaError(e);
        if(knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({data:"internal server error"},{status:st5xx.internalServerError});
    }
}