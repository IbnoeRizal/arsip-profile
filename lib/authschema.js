import z from "zod";
import { Category as CATEGORY, Role as ROLE } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/browser";

// user auth
// const ROLE = Object.freeze(["USER", "ADMIN"]);

export const USER_PATCH_BY_USER = z.object({
    [Prisma.UserScalarFieldEnum.name]: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    [Prisma.UserScalarFieldEnum.email] : z.email("format email salah").optional(),
    [Prisma.UserScalarFieldEnum.bio] : z.string().optional(),
    [Prisma.UserScalarFieldEnum.password]: z.string().min(8,"password minimal berisi 8 karakter").optional()
}).refine(obj=>Object.keys(obj).length > 0,{message: "tidak bisa mengupdate dengan data kosong"});

export const USER_PATCH_BY_ADMIN = z.object({
    [Prisma.UserScalarFieldEnum.name]:   z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    [Prisma.UserScalarFieldEnum.email] : z.email("format email salah").optional(),
    [Prisma.UserScalarFieldEnum.bio] :   z.string().optional(),
    [Prisma.UserScalarFieldEnum.role] :  z.enum(ROLE,"Role salah").optional(),
    [Prisma.UserScalarFieldEnum.jabatanId]:  z.cuid().nonempty("jabatan id tidak boleh kosong").optional(),
    [Prisma.UserScalarFieldEnum.password]: z.string().min(8,"password minimal berisi 8 karakter").optional()
}).refine(obj=>Object.keys(obj).length > 0,{message:"tidak bisa mengupdate dengan data kosong"});

export const USER_CREATE_BY_ADMIN = z.object({
    [Prisma.UserScalarFieldEnum.name]: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60),
    [Prisma.UserScalarFieldEnum.email]: z.email("format email salah"),
    [Prisma.UserScalarFieldEnum.bio]: z.string().optional(),
    [Prisma.UserScalarFieldEnum.role]: z.enum(ROLE,"role salah").optional(),
    [Prisma.UserScalarFieldEnum.password] : z.string().min(8,"password minimal berisi 8 karakter"),
    [Prisma.UserScalarFieldEnum.jabatanId]: z.cuid().nonempty("jabatan id tidak boleh kosong"),
});

export const USER_LOGIN = z.object({
    [Prisma.UserScalarFieldEnum.email] : z.email("format email salah"),
    [Prisma.UserScalarFieldEnum.password] : z.string().min(8,"password minimal berisi 8 karakter")
})

export const USER_DELETE_BY_ADMIN = z.object({
    [Prisma.UserScalarFieldEnum.id]: z.cuid().nonempty("id tidak boleh kosong").optional(),
    [Prisma.UserScalarFieldEnum.email] : z.email("format email salah").optional()
}).refine(obj=>Object.keys(obj).length > 0,{error:"tidak bisa menghapus data kosong"});



// driveObj auth
// const CATEGORY = Object.freeze(["PROFILEPIC", "FOLDER"]);

export const DRIVEOBJ_CREATE = z.object({
    [Prisma.DriveObjScalarFieldEnum.link]: z.string().nonempty("link tidak boleh kosong"),
    [Prisma.DriveObjScalarFieldEnum.name]: z.string().optional(),
    [Prisma.DriveObjScalarFieldEnum.userId]: z.cuid().optional(),
    [Prisma.DriveObjScalarFieldEnum.category] : z.enum(CATEGORY,"category tidak tersedia").optional(),
})

export const DRIVEOBJ_UPDATE = z.object({
    [Prisma.DriveObjScalarFieldEnum.link]: z.string().nonempty("link tidak boleh kosong").optional(),
    [Prisma.DriveObjScalarFieldEnum.name]: z.string().optional(),
    [Prisma.DriveObjScalarFieldEnum.userId]: z.cuid().optional(),
    [Prisma.DriveObjScalarFieldEnum.category]: z.enum(CATEGORY,"category tidak tersedia").optional()
}).refine(obj=>Object.keys(obj).length > 0, {message:"tidak bisa mengupdate data kosong"});

export const DRIVEOBJ_DELETE = z.object({
    [Prisma.DriveObjScalarFieldEnum.id] : z.cuid("pengenal tidak boleh kosong")
});

// jabatan auth
export const JABATAN_BY_ADMIN = z.object({
    [Prisma.JabatanScalarFieldEnum.title]: z.string().nonempty("title tidak boleh kosong")
})

export const JABATAN_DELETE_BY_ADMIN = z.object({
    [Prisma.JabatanScalarFieldEnum.id]: z.cuid("id harus berupa string").nonempty()
});

export const flaterr = z.flattenError;

// kelas auth
//update hanya perlu bagian nama
export const KELAS_CREATE_BY_ADMIN = z.object({
    [Prisma.KelasScalarFieldEnum.nama]: z.string().nonempty("nama tidak boleh kosong")
});

export const KELAS_DELETE_BY_ADMIN = z.object({
    [Prisma.KelasScalarFieldEnum.id]: z.cuid().nonempty("id tidak boleh kosong")
});

// mapel auth
// update hanya perlu bagian nama
export const MAPEL_CREATE_BY_ADMIN = z.object({
    [Prisma.MapelScalarFieldEnum.nama]: z.string().nonempty("nama tidak boleh kosong")
});

export const MAPEL_DELETE_BY_ADMIN = z.object({
    [Prisma.MapelScalarFieldEnum.id]: z.cuid().nonempty("id tidak boleh kosong")
});

// misi auth
export const MISI_CREATE_BY_ADMIN = z.object({
    [Prisma.MisiScalarFieldEnum.order] : z.coerce.number({ invalid_type_error: "format order adalah angka" }).int("order harus bilangan bulat").min(1, "order minimal 1"),
    [Prisma.MisiScalarFieldEnum.mision] : z.string().min(5,"karakter tidak memenuhi"),
    [Prisma.MisiScalarFieldEnum.idVisi] : z.cuid().nonempty("idVisi tidak boleh kosong")
});

export const MISI_DELETE_BY_ADMIN = z.object({
    [Prisma.MisiScalarFieldEnum.idVisi] : z.cuid().nonempty("idVisi tidak boleh kosong")
});

// export const MISIONS_CREATE_BY_ADMIN = z.array(MISI_CREATE_BY_ADMIN).min(1,"minimal berisi 1 data");

export const MISI_UPDATE_BY_ADMIN = z.object({
    [Prisma.MisiScalarFieldEnum.order] : z.number("format order adalah angka").optional(),
    [Prisma.MisiScalarFieldEnum.mision] : z.string().min(5,"karakter tidak memenuhi").optional(),
    [Prisma.MisiScalarFieldEnum.idVisi] : z.cuid().nonempty("idVisi tidak boleh kosong").optional()
}).refine(obj=>Object.keys(obj).length > 0, {message:"tidak bisa mengupdate data kosong"});

// visi auth
// visi hanya memiliki 1 field untuk diubah
export const VISI_CREATE_BY_ADMIN = z.object({
    [Prisma.VisiScalarFieldEnum.vision] : z.string().min(5,"visi minimal terdiri dari satu kalimat")
});

export const VISI_DELETE_BY_ADMIN = z.object({
    [Prisma.VisiScalarFieldEnum.id]: z.cuid().nonempty(),
});

export const MENGAJAR_CREATE_BY_ADMIN = z.object({
    [Prisma.MengajarScalarFieldEnum.idKelas]: z.cuid("kelas harus ada"),
    [Prisma.MengajarScalarFieldEnum.idMapel]: z.cuid("mapel harus ada"),
    [Prisma.MengajarScalarFieldEnum.idUser]: z.cuid("User Harus ada"),
});

export const MENGAJAR_DELETE_BY_ADMIN = z.object({
    [Prisma.MengajarScalarFieldEnum.id] : z.cuid("pengenal tidak ada")
});

export const MENGAJAR_UPDATE_BY_ADMIN = 
    MENGAJAR_CREATE_BY_ADMIN
    .partial()
    .refine((x)=>Object.entries(x).length > 0,{error:"tidak bisa mengedit data kosong"});

// Validation for server
export const SERVER_BLOG_CREATE = z.object({
    [Prisma.BlogScalarFieldEnum.idKelas] : z.cuid("harus berupa pengenal").optional(),
    [Prisma.BlogScalarFieldEnum.idMapel] : z.cuid("harus berupa pengenal").optional(),
    [Prisma.BlogScalarFieldEnum.idUser] : z.cuid("pengenal tidak boleh kosong"),
    [Prisma.BlogScalarFieldEnum.nama] : z.string().nonempty("nama blog wajib ada"),
    [Prisma.BlogScalarFieldEnum.eTag] : z.string(),
    [Prisma.BlogScalarFieldEnum.link] : z.url("format url salah")
})

// both for client and server
export const BLOG_UPDATE_BY_ADMIN = SERVER_BLOG_CREATE.pick({
    nama: true,
    idKelas: true,
    idMapel: true,
    idUser: true,
    eTag:true,
})
.partial({
    idUser:true,
    nama:true,
});

export const BLOG_UPDATE_BY_USER = SERVER_BLOG_CREATE.pick({
    nama: true,
    idKelas: true,
    idMapel: true,
    eTag:true,
})
.partial({
    nama:true
});

export const BLOG_DELETE = SERVER_BLOG_CREATE
.pick({eTag:true})
.extend({
    [Prisma.BlogScalarFieldEnum.id] : z.cuid("harus berupa pengenal blog")
});

//Validation for client
export const CLIENT_BLOG_CREATE = SERVER_BLOG_CREATE.partial({eTag:true}).omit({link:true});
 