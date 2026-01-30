import Login from "@/components/form/login";
import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import GetUserInfo from "./user.id";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;

  const [hasUser, user] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        driveObj:{
          where:{
            category:"POFILEPIC"
          },
          select:{
            link:true
          }
        }
      },
    }),
    getUserFromCookie(),
  ]);

  if (!hasUser || hasUser.id !== id) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5 bg-inherit justify-center mt-16 w-full items-center">
      <GetUserInfo key={id} id={id}/>

      <div></div>
      {!user &&<Login/>}
    </div>

  );
}
