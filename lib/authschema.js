import z from "zod";

// user auth
const ROLE = Object.freeze(["USER", "ADMIN"]);

export const USER_PATCH_BY_USER = z.object({
    name: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    email : z.email("format email salah").optional(),
    bio : z.string().optional(),
    password: z.string().min(8,"password minimal berisi 8 karakter").optional()
}).refine(obj=>Object.keys(obj).length > 0,{error: "tidak bisa mengupdate dengan data kosong"});

export const USER_PATCH_BY_ADMIN = z.object({
    name:   z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60).optional(),
    email : z.email("format email salah").optional(),
    bio :   z.string().optional(),
    role :  z.tuple(ROLE,"Role salah").optional(),
    JabatanId:  z.string().nonempty("jabatan id tidak boleh kosong").optional()
}).refine(obj=>Object.keys(obj).length > 0,{error:"tidak bisa mengupdate dengan data kosong"});

export const USER_CREATE_BY_ADMIN = z.object({
    name: z.string().min(5,"tidak boleh kurang dari 5 karakter").max(60),
    email: z.email("format email salah"),
    bio: z.string().optional(),
    role: z.tuple(ROLE,"role salah").optional(),
    password : z.string().min(8,"password minimal berisi 8 karakter"),
    JabatanId: z.string().nonempty("jabatan id tidak boleh kosong"),
});

export const USER_LOGIN = z.object({
    email : z.email("format email salah"),
    password : z.string().min(8,"password minimal berisi 8 karakter")
})

export const USER_DELETE_BY_ADMIN = z.object({
    id: z.string().nonempty("id tidak boleh kosong").optional(),
    email : z.email("format email salah").optional()
}).refine(obj=>Object.keys(obj).length < 1,{error:"tidak bisa menghapus data kosong"});



// driveObj auth
const CATEGORY = Object.freeze(["FILE", "FOLDER"]);

export const DRIVEOBJ_CREATE_BY_ADMIN = z.object({
    link: z.string().nonempty("link tidak boleh kosong"),
    useremail: z.email("format email salah").optional(),
    category : z.tuple(CATEGORY,"category tidak tersedia").optional(),
})

export const DRIVEOBJ_UPDATE_BY_ADMIN = z.object({
    link: z.string().nonempty("link tidak boleh kosong").optional(),
    useremail: z.email("format email salah").optional(),
    category: z.tuple(CATEGORY,"category tidak tersedia").optional()
}).refine(obj=>Object.keys(obj).length < 1, {error:"tidak bisa mengupdate data kosong"});

export const DRIVEOBJ_DELETE_BY_ADMIN = z.object({
    id : z.string("id harus berupa string").nonempty("id tidak boleh kosong")
});

// jabatan auth
export const JABATAN_BY_ADMIN = z.object({
    title: z.string().nonempty("title tidak boleh kosong")
})

export const JABATAN_DELETE_BY_ADMIN = z.object({
    id: z.string("id harus berupa string").nonempty()
})
export const flaterr = z.formatError;

// kelas auth
export const KELAS_CREATE_BY_ADMIN = z.object({
    nama: z.string().nonempty("nama tidak boleh kosong")
})

export const KELAS_DELETE_BY_ADMIN = z.object({
    id: z.string().nonempty("id tidak boleh kosong")
})