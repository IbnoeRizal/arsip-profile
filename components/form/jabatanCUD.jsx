"use client"
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { JABATAN_BY_ADMIN, JABATAN_DELETE_BY_ADMIN} from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";


/**
 * configuration needed to safely parse schema to fields
 */
/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
export const jabatanConfig = Object.freeze({
    [Prisma.JabatanScalarFieldEnum.id] : {
        type: "hidden",
        as: "input",
        parse: String
    },


   [Prisma.JabatanScalarFieldEnum.title]: {
        label: "Title",
        as:"input",
        parse: String,   
   } 
});


const STATUS_KEY_REACT = "jabatan_cud";

const {driveItems} = Prisma.JabatanScalarFieldEnum;

//verification
for(const item in driveItems){
    if(jabatanConfig[item])continue;

    throw new Error("jabatanConfig doesn't match database schema \n"+item)
}

// filled with refined fields zodauthentication + configuration
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : schemaToFields(JABATAN_BY_ADMIN,jabatanConfig)
    }),

    UPDATE: Object.freeze({
        ADMIN : schemaToFields(JABATAN_BY_ADMIN,jabatanConfig),
    }),

    DELETE: Object.freeze({
        ADMIN : schemaToFields(JABATAN_DELETE_BY_ADMIN,jabatanConfig)
    })
});

// request mode define url and method needed to fetch data to server
const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/Jabatan/",
        METHOD : "POST"
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/Jabatan/[id]",
        METHOD : "PATCH",
    }),

    DELETE : Object.freeze({
        URL : "/api/school/Jabatan/",
        METHOD : "DELETE"
    })
})



/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?     : Prisma.JabatanScalarFieldEnum[]
 *      fun?      : Function 
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function JabatanCUD({option,id,skip,fun}){
 
    return(
        <MergeDynaform 
            id={id} 
            option={option} 
            skip={skip}
            REFINED_FIELDS={REFINED_FIELDS}
            REQUEST_MODE={REQUEST_MODE}
            STATUS_KEY_REACT={STATUS_KEY_REACT}
            fun={fun}
        />
    )
}