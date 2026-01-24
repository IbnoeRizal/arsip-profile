import prisma from "../lib/prisma.js";

import visiMaker from "./factory/visifactory.js";
import misiMaker from "./factory/misifactory.js";
import kelasMaker from "./factory/kelasfactory.js";
import mapelMaker from "./factory/mapelfactory.js";
import userMaker from "./factory/userfactory.js";
import jabatanMaker from "./factory/jabatanfactory.js";
import driveObjMaker from "./factory/driveobjfactory.js";
import mengajarMaker from "./factory/mengajarfactory.js";

const daftar_kelas = ["kelas 1", "kelas 2", "kelas 3", "kelas 4", "kelas 5", "kelas 6"];
const daftar_mapel = ["Bahasa Inggris", "Bahasa Indonesia", "Matematika", "Bahasa Jawa", "Agama", "Olahraga"];
const daftar_jabatan = ["Guru", "Kepala Sekolah", "Wakil Kepala Sekolah", "Satpam"];
const user_count = 20;

async function seed(){
   const [idVisi,jabatan] = await Promise.all([
        prisma.visi.create({
            data:visiMaker(),
            select:{
                id:true
            }
        }),
        prisma.jabatan.createMany({
            data:jabatanMaker(daftar_jabatan),
            skipDuplicates:true
        })
   ]);

   console.table({idVisi,jabatan});

   const [misis,kelas,mapel,user] = await Promise.all([
        prisma.misi.createMany({
            data:misiMaker(idVisi.id,10),
            skipDuplicates:true
        }),
        prisma.kelas.createMany({
            data:kelasMaker(daftar_kelas),
            skipDuplicates:true
        }),
        prisma.mapel.createMany({
            data:mapelMaker(daftar_mapel),
            skipDuplicates:true
        }),
        prisma.user.createMany({
            data:await userMaker(user_count),
            skipDuplicates:true
        }),
   ])
   
   console.table({misis,kelas,mapel,user});

   const [driveObj,mengajar] = await Promise.all([
        prisma.driveObj.createMany({
            data:await driveObjMaker(user_count),
            skipDuplicates:true
        }),
        prisma.mengajar.createMany({
            data:await mengajarMaker(),
            skipDuplicates:true
        }),
   ]);

   console.table({driveObj,mengajar})


}

try{
    seed();
}catch(e){
    console.error(e);
}finally{
    prisma.$disconnect();
}