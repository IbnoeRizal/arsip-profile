import z, { email } from "zod"

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

export const flaterr = z.formatError;