"use client"
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { MISI_UPDATE_BY_ADMIN, MISI_DELETE_BY_ADMIN, MISI_CREATE_BY_ADMIN} from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";

/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const misiConfig = Object.freeze({
    [Prisma.MisiScalarFieldEnum.id]: {
        type:"hidden",
        as:"input",
        parse:String
    },

    [Prisma.MisiScalarFieldEnum.idVisi]:{
        label:"Visi",
        as:"select",
        source:{
            url : "/api/school/visi",
            getlabel: ["vision"],
            getvalue: ["id"]
        },
        parse: String,
    },

    [Prisma.MisiScalarFieldEnum.order]:{
        label:"Nomor",
        type:"number",
        parse: (x)=>Math.round(Number(x))
    },

    [Prisma.MisiScalarFieldEnum.mision]:{
        label:"Misi",
        as:"textarea",
        parse:String
    }
});


const STATUS_KEY_REACT = "misi_cud";


//check config, throw if doesn't match prismaschema

const {createdAt,updatedAt,...misiField} = Prisma.MisiScalarFieldEnum;
for(const field in misiField)
    if(!misiConfig[field])
        throw new Error("misiConfig doesn't match database schema \n"+field);

    
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : Object.freeze(schemaToFields(MISI_CREATE_BY_ADMIN,misiConfig)),
    }),
    UPDATE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(MISI_UPDATE_BY_ADMIN,misiConfig)),
    }),
    DELETE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(MISI_DELETE_BY_ADMIN,misiConfig))
    })
})

const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/misi/",
        METHOD: "POST",
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/misi/[id]",
        METHOD: "PATCH",
    }),

    DELETE: Object.freeze({
        URL : "/api/school/misi/",
        METHOD: "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.MisiScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function MisiCUD({option,id,skip,fun}){
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