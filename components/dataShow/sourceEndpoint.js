import { Prisma } from "@/generated/prisma/browser";

const TABLE = Prisma.ModelName;

export const sourceOfTruth = Object.freeze({
    [TABLE.User] : Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["name"]),
        source: "/api/user",
    }),

    [TABLE.Visi]:Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["vision"]),
        source: "/api/school/visi",
    }),

    [TABLE.Misi] : Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["mision"]),
        source: "/api/school/misi",
    }),

    [TABLE.Jabatan] : Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["title"]),
        source: "/api/school/Jabatan",
    }),

    [TABLE.Kelas] : Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["nama"]),
        source: "/api/school/kelas",
    }),

    [TABLE.Mapel] : Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["nama"]),
        source: "/api/school/mapel",
    }),

    [TABLE.Mengajar]: Object.freeze({
        key:Object.freeze(["id"]),
        label:Object.freeze(["user","name"]),
        source: "/api/school/mengajar",
    }),

    [TABLE.DriveObj]: Object.freeze({
        key: Object.freeze(["id"]),
        label: Object.freeze(["name"]),
        source: "/api/school/driveObj",
    }),

    [TABLE.Blog]: Object.freeze({
        key : Object.freeze(["id"]),
        label: Object.freeze(["nama"]),
        source: "/api/school/post"
    })
})