import z from "zod";
import { Category as CATEGORY, Role as ROLE } from "@/generated/prisma/enums";

// user auth
// const ROLE = Object.freeze(["USER", "ADMIN"]);

export const USER_PATCH_BY_USER = z.object({
    name: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    email : z.email("format email salah").optional(),
    bio : z.string().optional(),
    password: z.string().min(8,"password minimal berisi 8 karakter").optional()
}).refine(obj=>Object.keys(obj).length > 0,{message: "tidak bisa mengupdate dengan data kosong"});

export const USER_PATCH_BY_ADMIN = z.object({
    name:   z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    email : z.email("format email salah").optional(),
    bio :   z.string().optional(),
    role :  z.enum(ROLE,"Role salah").optional(),
    jabatanId:  z.cuid().nonempty("jabatan id tidak boleh kosong").optional()
}).refine(obj=>Object.keys(obj).length > 0,{message:"tidak bisa mengupdate dengan data kosong"});

export const USER_CREATE_BY_ADMIN = z.object({
    name: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60),
    email: z.email("format email salah"),
    bio: z.string().optional(),
    role: z.enum(ROLE,"role salah").optional(),
    password : z.string().min(8,"password minimal berisi 8 karakter"),
    jabatanId: z.cuid().nonempty("jabatan id tidak boleh kosong"),
});

export const USER_LOGIN = z.object({
    email : z.email("format email salah"),
    password : z.string().min(8,"password minimal berisi 8 karakter")
})

export const USER_DELETE_BY_ADMIN = z.object({
    id: z.cuid().nonempty("id tidak boleh kosong").optional(),
    email : z.email("format email salah").optional()
}).refine(obj=>Object.keys(obj).length > 0,{error:"tidak bisa menghapus data kosong"});



// driveObj auth
// const CATEGORY = Object.freeze(["PROFILEPIC", "FOLDER"]);

export const DRIVEOBJ_CREATE_BY_ADMIN = z.object({
    link: z.string().nonempty("link tidak boleh kosong"),
    userId: z.cuid().optional(),
    category : z.enum(CATEGORY,"category tidak tersedia").optional(),
})

export const DRIVEOBJ_UPDATE_BY_ADMIN = z.object({
    link: z.string().nonempty("link tidak boleh kosong").optional(),
    userId: z.cuid().optional(),
    category: z.enum(CATEGORY,"category tidak tersedia").optional()
}).refine(obj=>Object.keys(obj).length > 0, {message:"tidak bisa mengupdate data kosong"});

export const DRIVEOBJ_DELETE_BY_ADMIN = z.object({
    id : z.cuid("pengenal tidak boleh kosong")
});

// jabatan auth
export const JABATAN_BY_ADMIN = z.object({
    title: z.string().nonempty("title tidak boleh kosong")
})

export const JABATAN_DELETE_BY_ADMIN = z.object({
    id: z.cuid("id harus berupa string").nonempty()
});

export const flaterr = z.flattenError;

// kelas auth
//update hanya perlu bagian nama
export const KELAS_CREATE_BY_ADMIN = z.object({
    nama: z.string().nonempty("nama tidak boleh kosong")
});

export const KELAS_DELETE_BY_ADMIN = z.object({
    id: z.cuid().nonempty("id tidak boleh kosong")
});

// mapel auth
// update hanya perlu bagian nama
export const MAPEL_CREATE_BY_ADMIN = z.object({
    nama: z.string().nonempty("nama tidak boleh kosong")
});

export const MAPEL_DELETE_BY_ADMIN = z.object({
    id: z.cuid().nonempty("id tidak boleh kosong")
});

// misi auth
export const MISI_CREATE_BY_ADMIN = z.object({
    order : z.coerce.number({ invalid_type_error: "format order adalah angka" }).int("order harus bilangan bulat").min(1, "order minimal 1"),
    mision : z.string().min(5,"karakter tidak memenuhi"),
    idVisi : z.cuid().nonempty("idVisi tidak boleh kosong")
});

export const MISI_DELETE_BY_ADMIN = z.object({
    idVisi : z.cuid().nonempty("idVisi tidak boleh kosong")
});

// export const MISIONS_CREATE_BY_ADMIN = z.array(MISI_CREATE_BY_ADMIN).min(1,"minimal berisi 1 data");

export const MISI_UPDATE_BY_ADMIN = z.object({
    order : z.number("format order adalah angka").optional(),
    mision : z.string().min(5,"karakter tidak memenuhi").optional(),
    idVisi : z.cuid().nonempty("idVisi tidak boleh kosong").optional()
}).refine(obj=>Object.keys(obj).length > 0, {message:"tidak bisa mengupdate data kosong"});

// visi auth
// visi hanya memiliki 1 field untuk diubah
export const VISI_CREATE_BY_ADMIN = z.object({
    vision : z.string().min(5,"visi minimal terdiri dari satu kalimat")
});

export const VISI_DELETE_BY_ADMIN = z.object({
    id: z.cuid().nonempty(),
});

export const MENGAJAR_CREATE_BY_ADMIN = z.object({
    idKelas: z.cuid("kelas harus ada"),
    idMapel: z.cuid("mapel harus ada"),
    idUser: z.cuid("User Harus ada"),
});

export const MENGAJAR_DELETE_BY_ADMIN = z.object({
    id : z.cuid("pengenal tidak ada")
});

export const MENGAJAR_UPDATE_BY_ADMIN = 
    MENGAJAR_CREATE_BY_ADMIN
    .partial()
    .refine((x)=>Object.entries(x).length > 0,{error:"tidak bisa mengedit data kosong"});