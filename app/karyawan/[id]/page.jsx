import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import GetUserInfo from "./user.id";
import { notFound } from "next/navigation";
import { Category, Role } from "@/generated/prisma/enums";
import ContainerDriveItems from "./owned_drive_items";

export default async function Page({ params }) {
  const { id } = await params;

  const [hasUser, user] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        driveObj:{
          select:{
            id: true,
            link:true,
            category:true
          }
        }
      },
    }),
    getUserFromCookie(),
  ]);

  if (!hasUser || hasUser.id !== id) {
    notFound();
  }

  const result = Object.groupBy(hasUser.driveObj, ({category})=>
    category === Category.POFILEPIC ? "picture" : "fileOrFolder"
  );


  return (
    <div className="flex flex-col gap-5 bg-inherit justify-center mt-16 w-full items-center">
      <GetUserInfo key={id} id={id}/>
      {user && ( user.id === id || user.role === Role.ADMIN )&& 
        <section className="container flex flex-col justify-center items-center gap-4"> 
          <h1>Daftar File</h1>
          <ContainerDriveItems items={result.fileOrFolder} userId={hasUser.id}/>
        </section>
      }
    </div>

  );
}
