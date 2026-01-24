import prisma from "../../lib/prisma.js";
import { fakerID_ID } from "@faker-js/faker";

export default async function driveObjMaker(count){
    if(typeof count !== "number" && !Number.isFinite(count))
        throw Error("count must be a number and finite");
    
    const ids  = await prisma.user.findMany({
        select:{
            id:true,
        }
    });

    const data = [];
    for(let i = 0; i < Math.min(ids.length, count); ++i){
        data.push(Object.freeze({
            link : fakerID_ID.internet.url(),
            userId : ids[i].id
        }));
    }

    return data;
}