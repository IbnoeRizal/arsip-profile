"use client"
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { KELAS_CREATE_BY_ADMIN, KELAS_DELETE_BY_ADMIN} from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";

/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const kelasConfig = Object.freeze({
    [Prisma.KelasScalarFieldEnum.id]: {
        type:"hidden",
        as:"input",
        parse:String
    },

    [Prisma.KelasScalarFieldEnum.nama]:{
        label:"Nama Kelas",
        as:"input" ,
        parse: String,
    },
});


const STATUS_KEY_REACT = "kelas_cud";


//check config, throw if doesn't match prismaschema

const {createdAt,updatedAt,...kelasFields} = Prisma.KelasScalarFieldEnum;
for(const field in kelasFields)
    if(!kelasConfig[field])
        throw new Error("kelasConfig doesn't match database schema \n"+field);

    
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : Object.freeze(schemaToFields(KELAS_CREATE_BY_ADMIN,kelasConfig)),
    }),
    UPDATE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(KELAS_CREATE_BY_ADMIN,kelasConfig)),
    }),
    DELETE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(KELAS_DELETE_BY_ADMIN,kelasConfig))
    })
})

const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/kelas/",
        METHOD: "POST",
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/kelas/[id]",
        METHOD: "PATCH",
    }),

    DELETE: Object.freeze({
        URL : "/api/school/kelas/",
        METHOD: "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.KelasScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function KelasCUD({option,id,skip,fun}){
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