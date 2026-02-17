'use client'
import { Prisma, $Enums } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { DRIVEOBJ_CREATE, DRIVEOBJ_DELETE, DRIVEOBJ_UPDATE } from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";



/**
 * configuration needed to safely parse schema to fields
 */
/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
const driveConfig = Object.preventExtensions({
    [Prisma.DriveObjScalarFieldEnum.id] :{
        type:"hidden",
        as: "input",
        parse: String,
    },

    [Prisma.DriveObjScalarFieldEnum.link] : {
        label : "Link",
        as: "input",
        type: "url",
        parse: String,
    },

    [Prisma.DriveObjScalarFieldEnum.userId] : {
        label : "Pilih User",
        as: "select",
        source : {
            getlabel: ["name"],
            getvalue: ["id"],
            url: "/api/user"
        }
    },

    [Prisma.DriveObjScalarFieldEnum.category]: {
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
        ADMIN : schemaToFields(DRIVEOBJ_CREATE,driveConfig),
        USER : schemaToFields(DRIVEOBJ_CREATE,driveConfig)

    }),

    UPDATE: Object.freeze({
        ADMIN : schemaToFields(DRIVEOBJ_UPDATE,driveConfig),
        USER  : schemaToFields(DRIVEOBJ_UPDATE,driveConfig),
    }),

    DELETE: Object.freeze({
        ADMIN : schemaToFields(DRIVEOBJ_DELETE,driveConfig),
        USER : schemaToFields(DRIVEOBJ_DELETE,driveConfig),
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
 *      skip?    : Prisma.DriveObjScalarFieldEnum[]
 *      fun?     : Function
 *      default? : Record<Prisma.DriveObjScalarFieldEnum,string|number>
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function DriveObjCUD({option,id,skip,fun,default:defaultData = {}}){
 
    return(
        <MergeDynaform 
            id={id} 
            option={option} 
            skip={skip}
            REFINED_FIELDS={REFINED_FIELDS}
            REQUEST_MODE={REQUEST_MODE}
            STATUS_KEY_REACT={STATUS_KEY_REACT}
            fun={fun}
            default={defaultData}
        />
    )
}