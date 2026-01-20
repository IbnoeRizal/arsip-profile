import { Prisma } from "@prisma/client";
import { st4xx, st5xx } from "./responseCode";
import { NextResponse } from "next/server";

/**@type {Map<string,[string,number]>} */
const causes = (function(){
    if (globalThis.causesError)
        return globalThis.causesError;

    const reason = new Map([
        ["P2002",["data sudah ada",st4xx.forbidden]],
        ["P2001",["Tidak menemukan data yang dicari",st4xx.notFound]],
        ["P2025",["Tidak menemukan data yang dicari",st4xx.notFound]],
        ["P2000",["data input terlalu panjang",st4xx.badRequest]],
    ]);
    
    if ( process.env.NODE_ENV != 'production')
        globalThis.causesError= reason;

    return reason;
})();

/**
 * @param {Error} error 
 * @returns {NextResponse | null}
 */
export function prismaError(error){
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code && causes.has(error.code)){
        const [reason,statusCode] = causes.get(error.code);
        return NextResponse.json({data:reason},{status:statusCode});
    }

    if(error instanceof Prisma.PrismaClientInitializationError)
        return NextResponse.json({data:"masalah sever/db"},{status:st5xx.internalServerError});

    return null;
}