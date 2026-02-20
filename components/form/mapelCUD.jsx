"use client"
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { MAPEL_CREATE_BY_ADMIN, MAPEL_DELETE_BY_ADMIN} from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";

/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const mapelConfig = Object.freeze({
    [Prisma.MapelScalarFieldEnum.id]: {
        type:"hidden",
        as:"input",
        parse:String
    },

    [Prisma.MapelScalarFieldEnum.nama]:{
        label:"Nama Mapel",
        as:"input" ,
        parse: String,
    },
});


const STATUS_KEY_REACT = "mapel_cud";


//check config, throw if doesn't match prismaschema

const {createdAt,updatedAt,...mapelFields} = Prisma.MapelScalarFieldEnum;
for(const field in mapelFields)
    if(!mapelConfig[field])
        throw new Error("mapelConfig doesn't match database schema \n"+field);

    
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : Object.freeze(schemaToFields(MAPEL_CREATE_BY_ADMIN,mapelConfig)),
    }),
    UPDATE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(MAPEL_CREATE_BY_ADMIN,mapelConfig)),
    }),
    DELETE: Object.freeze({
        ADMIN: Object.freeze(schemaToFields(MAPEL_DELETE_BY_ADMIN,mapelConfig))
    })
})

const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/mapel/",
        METHOD: "POST",
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/mapel/[id]",
        METHOD: "PATCH",
    }),

    DELETE: Object.freeze({
        URL : "/api/school/mapel/",
        METHOD: "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.MapelScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function MapelCUD({option,id,skip,fun}){
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