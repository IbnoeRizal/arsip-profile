import { unstable_cache,revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { Category } from "@/generated/prisma/browser";

const get_user_by_id = "user-by-id";
const profile_pic = "profile-pic";

export const PROFLE_PIC = Object.freeze({
    getProfilePic : unstable_cache(
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
    [profile_pic],
    { 
        revalidate: 360,
        tags:[profile_pic]
    }
    ),
    
    revalidate : ()=>revalidateTag(profile_pic,"max")
});

export const USER_GET_BY_ID = Object.freeze({
    getUser : unstable_cache(
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
        [get_user_by_id],
        {
            tags:[get_user_by_id],
            revalidate:360
        }
    ),

    revalidate : ()=>revalidateTag(get_user_by_id,"max")
})