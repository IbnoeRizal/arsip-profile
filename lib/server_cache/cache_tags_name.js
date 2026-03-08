import { unstable_cache,revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { Category } from "@/generated/prisma/browser";

const get_user_by_id = "user-by-id";
const profile_pic = "profile-pic";
const revalidate_sec = 86400;

export const PROFLE_PIC = Object.freeze({
    getProfilePic : (id)=>unstable_cache(
        async (id) => {
            return prisma.driveObj.findFirst({
                select: {
                    id:true,
                    link: true,
                },
                where: {
                    userId: id,
                    category: Category.POFILEPIC,
                },
            });
        },
    [`${profile_pic} ${id}`],
    { 
        revalidate: revalidate_sec,
        tags:[`${profile_pic} ${id}`]
    }
    )(id),
    
    revalidate : (id)=>revalidateTag(`${profile_pic} ${id}`,"max")
});

export const USER_GET_BY_ID = Object.freeze({
    getUser : (id)=>unstable_cache(
        async(id)=>{
            return await prisma.user.findUniqueOrThrow({
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
            })
        },
        [`${get_user_by_id} ${id}`],
        {
            tags:[`${get_user_by_id} ${id}`],
            revalidate:revalidate_sec
        }
    )(id),

    revalidate : (id)=>revalidateTag(`${get_user_by_id} ${id}`,"max")
})

export const BLOB_GET_RAW_BY_URL = Object.freeze({
    getBlog: async(url)=>fetch(url,{next:{
        tags:[`blob ${url}`],
        revalidate:revalidate_sec
    }}),

    revalidate: (url)=>revalidateTag(`blob ${url}`,`max`)
})