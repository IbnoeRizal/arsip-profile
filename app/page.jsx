'use cache'
import prisma from "@/lib/prisma";
import { Boxinfo } from "@/components/boxinfo";
import { Logo } from "@/components/logo";
import Image from "next/image";
import ImageSlider from "@/components/image-slider";

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
        <h1 className="text-4xl font-bold text-center ml">SDN 2 GEDOG</h1>
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
      <div className="mt-10 min-h-screen bg-[url('/gambar-tentang-sekolah/pemandangan-depan-sekolah.jpg')] bg-cover bg-center flex flex-col items-center justify-center p-3">

        <div className="backdrop-blur-md bg-black/45 p-8 rounded-xl text-white flex flex-col gap-6 w-full mx-10 border-white border-2">
          
          <h1 className="text-xl font-bold self-start">Tentang Sekolah</h1>

          <hr className="border-white" />

          <div className="flex flex-col gap-4">
            <p className="text-left indent-8">UPT Satuan Pendidikan SDN 2 Gedog merupakan sekolah dasar yang berlokasi di Jalan Irogati No. 11, Kelurahan Gedog, Kecamatan Sananwetan, Kota Blitar. Sekolah ini berada di lingkungan yang asri, tepat di depan area persawahan, sehingga memiliki udara yang sejuk dan suasana yang nyaman untuk kegiatan belajar mengajar. Pemandangan hijau yang mengelilingi sekolah turut menciptakan lingkungan yang mendukung kenyamanan peserta didik. Selain itu, sekolah juga memiliki halaman yang luas sehingga siswa dapat bermain dan beraktivitas dengan leluasa.</p>
            <p className="text-left indent-8">Untuk menunjang kegiatan pembelajaran, sekolah dilengkapi dengan berbagai sarana dan prasarana, seperti musala, ruang kepala sekolah, ruang guru, enam ruang kelas, ruang UKS, ruang perpustakaan, rumah dinas, kantin, serta fasilitas kamar mandi bagi siswa dan guru. Selain itu, tersedia juga satu set alat hadrah dan perlengkapan kegiatan ekstrakurikuler pramuka sebagai wadah pengembangan minat dan bakat.</p>
          </div>
          <ImageSlider/>
        </div>

      </div>
      <div className="mx-auto w-fit my-auto" >
        <Logo width={500} height={500} alt={"slogan"} src={"/Slogan-Sekolah.png"}></Logo>
      </div>
    </>
  );
}
