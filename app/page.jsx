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
        }
      }
    }
  });

  return (
    <> 
      <div className="backdrop-blur-3xl md">
        <h1 className="text-4xl font-bold text-center mt-20 ml">SDN 2 Gedog</h1>
      </div>
      <div className="mx-auto w-fit my-auto">
        <Logo width={500} height={500}/>
      </div>
      <div className="mt-50">
        <div className="text-2xl font-bold text-left ml-20 mt-20"> Visi </div>
        {visi && <Boxinfo infos={visi.map(x=>({...x,info:x.vision}))}/>}
      </div>
      <div className="mt-50">
        <div className="text-2xl font-bold text-left ml-20 mt-20"> Misi </div>
        {visi && visi.misi && <Boxinfo infos={visi.misi.map(x=>({...x,info:x.mision}))}/>}
      </div>
    </>
  );
}
