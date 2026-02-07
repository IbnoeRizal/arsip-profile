import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import GetUserInfo from "./user.id";
import { notFound } from "next/navigation";
import { Category } from "@/generated/prisma/enums";
import DriveItems from "@/components/driveItem";

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
      {user && user.id === id && 
        <section className="container flex flex-col justify-center items-center gap-4"> 
          <h1>Daftar File</h1>
          <div className="container self-center sm:grid sm:grid-cols-3 sm:place-content-center sm:place-items-center-stretch flex justify-center items-center flex-wrap gap-4 border border-dotted sm:p-5 rounded-md *:hover:brightness-90">
            {
              result.fileOrFolder?.map((obj) => (<DriveItems key={obj.id} {...obj}/>))
            }
          </div>
        </section>
      }
    </div>

  );
}
