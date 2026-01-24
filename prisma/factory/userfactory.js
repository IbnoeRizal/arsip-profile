import { fakerID_ID } from "@faker-js/faker";
import prisma from "../../lib/prisma.js";

export default async function userMaker(count){
    if(typeof count != "number" && !Number.isFinite(count))
        throw Error("count is not a number or not finite");

    const ids = await prisma.jabatan.findMany({
        select:{
            id:true
        }
    });

    const result = [];

    for(let i = 0; i < count; ++i){
        const [first,last] = fakerID_ID.person.fullName().split(" ");
        
        const res = {
            name: first+" "+last,
            email: fakerID_ID.internet.email({firstName:first, lastName:last, allowSpecialCharacters:true}),
            bio: fakerID_ID.person.bio(),
            password: fakerID_ID.internet.password({length:10}),
        }
        if(ids?.length){
            const index = Math.floor(Math.random()*ids.length);
            res.jabatanId = ids[index].id;
        }
        result.push(Object.freeze(res));
    }

    return result;
}