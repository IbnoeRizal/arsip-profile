"use client"
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import {  VISI_CREATE_BY_ADMIN, VISI_DELETE_BY_ADMIN} from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";

/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const visiConfig = Object.freeze({
    [Prisma.VisiScalarFieldEnum.id]: {
        type:"hidden",
        as:"input",
        parse:String
    },

    [Prisma.VisiScalarFieldEnum.vision]:{
        label:"Visi",
        as:"input",
        parse: String,
    },
});


const STATUS_KEY_REACT = "visi_cud";


//check config, throw if doesn't match prismaschema

const {createdAt,updatedAt,...visiFields} = Prisma.VisiScalarFieldEnum;
for(const field in visiFields)
    if(!visiConfig[field])
        throw new Error("visiConfig doesn't match database schema \n"+field);

    
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : Object.freeze(schemaToFields(VISI_CREATE_BY_ADMIN,visiConfig)),
    }),
    UPDATE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(VISI_CREATE_BY_ADMIN,visiConfig)),
    }),
    DELETE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(VISI_DELETE_BY_ADMIN,visiConfig))
    })
})

const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/visi/",
        METHOD: "POST",
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/visi/[id]",
        METHOD: "PATCH",
    }),

    DELETE: Object.freeze({
        URL : "/api/school/visi/",
        METHOD: "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.VisiScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function VisiCUD({option,id,skip,fun}){
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