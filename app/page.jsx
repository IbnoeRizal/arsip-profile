'use cache'
import prisma from "@/lib/prisma";
import { Boxinfo } from "@/components/boxinfo";
import { Logo } from "@/components/logo";

export default async function Home() {
  const visi = await prisma.visi.findFirst({
    select:{
      id: true,
      vision : true,
      misi:{
        select:{
          id: true,
          mision: true,
        },
        orderBy:{
          order:"asc"
        }
      }
    }
  });

  return (
    <> 
      <div className="m-auto">
        <h1 className="text-4xl font-bold text-center mt-20 ml">SDN 2 GEDOG</h1>
      </div>
      <div className="mx-auto w-fit my-auto">
        <Logo width={500} height={500} alt={"Logo Sekolah"} src={"/Logo-Sekolah.svg"}/>
      </div>
      <div className="mt-50 ml-10 mr-10">
        <div className="text-2xl font-bold text-left"> Visi </div>
        {visi && <Boxinfo infos={[{...visi, info: visi.vision}]}/>}
      </div>
      <div className="mt-2 ml-10 mr-10">
        <div className="text-2xl font-bold text-left"> Misi </div>
        {visi && visi.misi && <Boxinfo infos={visi.misi.map(x=>({...x,info:x.mision}))}/>}
      </div>
      <div className="mx-auto w-fit my-auto" >
        <Logo width={500} height={500} alt={"slogan"} src={"/Slogan-Sekolah.png"}></Logo>
      </div>
    </>
  );
}
