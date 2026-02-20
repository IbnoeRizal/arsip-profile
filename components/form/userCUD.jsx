"use client"
import { Role,Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { USER_CREATE_BY_ADMIN, USER_DELETE_BY_ADMIN, USER_PATCH_BY_ADMIN, USER_PATCH_BY_USER } from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";
import { useCredential } from "@/context/usercredential";

/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const userConfig = Object.freeze({
    [Prisma.UserScalarFieldEnum.id]: {
        type:"hidden",
        parse:String
    },

    [Prisma.UserScalarFieldEnum.name]:{
        label:"Nama",
        type:"text" ,
        parse: String,
    },

    [Prisma.UserScalarFieldEnum.email]:{
        label: "Email",
        type:"email",
        parse: String,
    },

    [Prisma.UserScalarFieldEnum.bio]:{
        label: "Bio",
        as: "textarea",
        parse: String,
    },

    [Prisma.UserScalarFieldEnum.role]:{
        label: "Role",
        as:"select",
        options: Object.entries(Role).map(([label,value])=>({label,value})),
        parse : String,
    },


    [Prisma.UserScalarFieldEnum.jabatanId]:{
        label: "Jabatan",
        as:"select",
        parse: String,
        source: {
            url : "/api/school/Jabatan/",
            getlabel: ["title"],
            getvalue: ["id"]
        }
    },

    [Prisma.UserScalarFieldEnum.password]:{
        label: "Password",
        type: "password",
        parse: String
    }
});


const STATUS_KEY_REACT = "user_cud";


//check config, throw if doesn't match prismaschema

const {createdAt,updatedAt,...userfields} = Prisma.UserScalarFieldEnum;
for(const field in userfields)
    if(!userConfig[field])
        throw new Error("userconfig doesn't match database schema \n"+field);

    
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : Object.freeze(schemaToFields(USER_CREATE_BY_ADMIN,userConfig)),
    }),
    UPDATE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(USER_PATCH_BY_ADMIN,userConfig)),
        USER: Object.freeze(schemaToFields(USER_PATCH_BY_USER,userConfig))
    }),
    DELETE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(USER_DELETE_BY_ADMIN,userConfig))
    })
})

const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/user/",
        METHOD: "POST",
    }),

    UPDATE : Object.freeze({
        URL : "/api/user/[id]",
        METHOD: "PATCH",
    }),

    DELETE: Object.freeze({
        URL : "/api/user/",
        METHOD: "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.UserScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function UserCUD({option,id,skip,fun}){
    const credential = useCredential();
    if(credential.id === id)
        id = "me";
    return <MergeDynaform 
        id={id} 
        option={option} 
        skip={skip} 
        REFINED_FIELDS={REFINED_FIELDS}
        REQUEST_MODE={REQUEST_MODE}
        STATUS_KEY_REACT={STATUS_KEY_REACT}
        fun={fun}
    />
}