import { authError, getUserFromRequest, requireRole } from "@/lib/auth";
import { BLOG_UPDATE_BY_ADMIN, BLOG_UPDATE_BY_USER } from "@/lib/authschema";
import prisma from "@/lib/prisma";
import { prismaError } from "@/lib/prismaErrorResponse";
import { st2xx, st4xx, st5xx } from "@/lib/responseCode";
import { Role } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { BLOB_GET_RAW_BY_URL } from "@/lib/server_cache/cache_tags_name";

const CALLBACK_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? `https://${process.env.VERCEL_URL}`;

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>} 
 */
export async function GET(request, context) {
    try {

        const { id } = await context.params

        const blogdata = await prisma.blog.findUnique({
            where: {
                id
            },
            select: {
                link: true
            }
        });

        const result = await BLOB_GET_RAW_BY_URL.getBlog(blogdata.link);
        
        return new NextResponse(result.body, { headers:result.headers, status: st2xx.ok });

    } catch (e) {
        const knownErr = authError(e) ?? prismaError(e);
        if (knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({ data: "internal server error" }, { status: st5xx.internalServerError });
    }
}

/**
 * @param {import("next/server").NextRequest} request 
 * @param {{params:Promise<{id:string}>}} context
 * @returns {Promise<NextResponse>} 
 */
export async function POST(request,context) {
    try {
        const [payload, body,{id}] = await Promise.all([
            getUserFromRequest(request),
            request.json(),
            context.params
        ]);

        if(payload){
            await prisma.blog.findFirstOrThrow({
                where:{
                    id,
                    nama:body.payload.pathname
                }
            });
        }


        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                requireRole(payload,[Role.ADMIN,Role.USER]);

                const isAdmin = payload?.role === Role.ADMIN;

                const switcher = isAdmin? BLOG_UPDATE_BY_ADMIN : BLOG_UPDATE_BY_USER;

                const {eTag,...newPayload} = switcher.parse({
                    ...(JSON.parse(clientPayload))
                });


                const withRole = {...newPayload, role:payload.role}

                return {
                    allowedContentTypes: ["text/markdown"],
                    tokenPayload: JSON.stringify(withRole),
                    callbackUrl: `${CALLBACK_BASE_URL}/api/school/post/${id}`,
                    ifMatch: eTag,
                    allowOverwrite:true,
                }
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {

                const {role,...tokenPayloadObj} = JSON.parse(tokenPayload);

                const switcher = role === Role.ADMIN? BLOG_UPDATE_BY_ADMIN : BLOG_UPDATE_BY_USER;

                const data = switcher.parse({
                    ...tokenPayloadObj,
                    eTag: blob.etag,
                    nama: blob.pathname
                });
                

                await prisma.blog.update({
                    data,
                    where:{
                        id
                    }
                })
 
                BLOB_GET_RAW_BY_URL.revalidate(blob.url);
            }

        })


        return NextResponse.json(jsonResponse);
    } catch (e) {
        const knownErr = authError(e) ?? prismaError(e);
        if (knownErr) return knownErr;
        console.error(e);
        return NextResponse.json({ data: "internal server error" }, { status: st5xx.internalServerError });
    }
}