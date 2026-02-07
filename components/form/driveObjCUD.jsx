'use client'
import { Prisma, $Enums } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { DRIVEOBJ_CREATE_BY_ADMIN, DRIVEOBJ_DELETE_BY_ADMIN, DRIVEOBJ_UPDATE_BY_ADMIN } from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";



/**
 * configuration needed to safely parse schema to fields
 */
/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
const driveConfig = Object.preventExtensions({
    id :{
        type:"hidden",
        as: "input",
        parse: String,
    },

    link : {
        label : "Link",
        as: "input",
        type: "url",
        parse: String,
    },

    userId : {
        type: "hidden",
        as: "input",
        parse: String,
    },

    category: {
        label:"Kategori",
        as:"select",
        options: Object.entries($Enums.Category).map(([label,value])=>({label,value})),
        parse:String
    }
});

const STATUS_KEY_REACT = "driveOBJ_cud";

const {createdAt,updatedAt, ...driveItems} = Prisma.DriveObjScalarFieldEnum;

//verification
for(const item in driveItems){
    if(driveConfig[item])continue;

    throw new Error("driveconfig doesn't match database schema \n"+item)
}

// filled with refined fields zodauthentication + configuration
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : schemaToFields(DRIVEOBJ_CREATE_BY_ADMIN,driveConfig)
    }),

    UPDATE: Object.freeze({
        ADMIN : schemaToFields(DRIVEOBJ_UPDATE_BY_ADMIN,driveConfig),
    }),

    DELETE: Object.freeze({
        ADMIN : schemaToFields(DRIVEOBJ_DELETE_BY_ADMIN,driveConfig)
    })
});

// request mode define url and method needed to fetch data to server
const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/driveObj/",
        METHOD : "POST"
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/driveObj/[id]",
        METHOD : "PATCH",
    }),

    DELETE : Object.freeze({
        URL : "/api/school/driveObj/",
        METHOD : "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip     : ("id" | "link" | "userId" | "category")[] | undefined  
 *      fun      : Function | null | undefined 
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function DriveObjCUD({option,id,skip,fun}){
 
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