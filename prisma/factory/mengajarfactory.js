import prisma from "../../lib/prisma.js";
import { faker } from "@faker-js/faker";

function pickRandom(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default async function mengajarMaker() {
    const [id_users,id_kelass,id_mapels] = await Promise.all([
        prisma.user.findMany({select:{id:true}}),
        prisma.kelas.findMany({select:{id:true}}),
        prisma.mapel.findMany({select:{id:true}}),
    ]);

    if(!(id_users?.length && id_kelass?.length && id_mapels?.length))
        throw Error("user, mapel, and kelas must not be an empty table in database");

    const data = [];

    for (const user of id_users) {
        const pickedKelas = pickRandom(id_kelass, faker.number.int({ min: 1, max: 3 }))

        for (const k of pickedKelas) {
        const pickedMapel = pickRandom(id_mapels, faker.number.int({ min: 1, max: 3 }))

            for (const m of pickedMapel) {
                data.push({
                idUser: user.id,
                idKelas: k.id,
                idMapel: m.id,
                });
            }
        }
    }

    return data;
}