'use client'
import { Prisma } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { MENGAJAR_CREATE_BY_ADMIN, MENGAJAR_DELETE_BY_ADMIN, MENGAJAR_UPDATE_BY_ADMIN, } from "@/lib/authschema";
import { MergeDynaform } from "./dynamicform/mergerform";



/**
 * configuration needed to safely parse schema to fields
 */
/**@type {{ [key: string]: import("@/components/form/dynamicform/dynamicform").Field }}  */
const mengajarConfig = Object.preventExtensions({
    [Prisma.MengajarScalarFieldEnum.id] :{
        type:"hidden",
        as: "input",
        parse: String,
    },

    [Prisma.MengajarScalarFieldEnum.idUser] :{
        label:"User",
        as: "select",
        source:{
            url: "/api/user",
            getlabel:["name"],
            getvalue:["id"]
        },
        parse: String,
    },

    [Prisma.MengajarScalarFieldEnum.idMapel] :{
        label:"Mata Pelajaran",
        as: "select",
        source:{
            url: "/api/school/mapel",
            getlabel:["nama"],
            getvalue:["id"]
        },
        parse: String,
    },

    [Prisma.MengajarScalarFieldEnum.idKelas] :{
        label:"Kelas",
        as: "select",
        source:{
            url: "/api/school/kelas",
            getlabel:["nama"],
            getvalue:["id"]
        },
        parse: String,
    },
});

const STATUS_KEY_REACT = "mengajar_cud";

const {createdAt, ...mengajarItems} = Prisma.MengajarScalarFieldEnum;

//verification
for(const item in mengajarItems){
    if(mengajarConfig[item])continue;

    throw new Error("mengajarConfig doesn't match database schema \n"+item)
}

// filled with refined fields zodauthentication + configuration
const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : schemaToFields(MENGAJAR_CREATE_BY_ADMIN,mengajarConfig)
    }),

    UPDATE: Object.freeze({
        ADMIN : schemaToFields(MENGAJAR_UPDATE_BY_ADMIN,mengajarConfig),
    }),

    DELETE: Object.freeze({
        ADMIN : schemaToFields(MENGAJAR_DELETE_BY_ADMIN,mengajarConfig)
    })
});

// request mode define url and method needed to fetch data to server
const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/mengajar/",
        METHOD : "POST"
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/mengajar/[id]",
        METHOD : "PATCH",
    }),

    DELETE : Object.freeze({
        URL : "/api/school/mengajar/",
        METHOD : "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.MengajarScalarFieldEnum[]
 *      fun?     : Function
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function MengajarCUD({option,id,skip,fun}){
 
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