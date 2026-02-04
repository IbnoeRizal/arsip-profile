'use client'
import { Prisma, $Enums } from "@/generated/prisma/browser";
import DynamicForm from "@/components/form/dynamicform";
import schemaToFields from "@/lib/schemaToFields";
import { DRIVEOBJ_CREATE_BY_ADMIN, DRIVEOBJ_DELETE_BY_ADMIN, DRIVEOBJ_UPDATE_BY_ADMIN } from "@/lib/authschema";
import { useCredential } from "@/context/usercredential";
import { useEffect, useRef, useState } from "react";
import Status from "@/components/status";
import handleParseResponse from "@/lib/fetch/handlefetch";
import Loader from "@/components/loading";



/**
 * configuration needed to safely parse schema to fields
 */
/**@type {{ [key: string]: import("@/components/form/dynamicform").Field }}  */
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
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function DriveObjCUD({option,id,skip}){
    const userCredential = useCredential();
    const [optionForm, setOptionForm] = useState(REFINED_FIELDS[option]?? null);
    const [isLoading, setLoading] = useState(false);
    const status = useRef({
        message:"",
        code:0
    })

    const controller = useRef(null);
    useEffect(()=>{
        setOptionForm(REFINED_FIELDS[option]??null)
    },[option,userCredential.id,userCredential.role,id])
    
    async function handleSubmit(data){
        setLoading(true);
        controller.current?.abort();
        controller.current = new AbortController();
        
        let {URL,METHOD} = REQUEST_MODE[option]?? REQUEST_MODE.CREATE;
        URL = URL.replace("[id]", id);


        const request = new Request(URL,{
            body:JSON.stringify(data),
            method:METHOD,
            headers:{
                "content-type":"application/json"
            },
            signal: controller.current.signal
        });
        
        try {
            const response = await fetch(request);
            const body = await handleParseResponse(response);

            status.current.message = body.data ?? (String(body).length < 100 ? body :null) ?? response.statusText;
            status.current.code = response.status;

        } catch (err) {
            if(process.env.NODE_ENV === "development" && err.name !== "AbortError")
                console.error(err);

        }finally{
            setLoading(false);
        }

    }

    if(isLoading)
        return(<span><h3>Loading </h3><Loader/></span>)

    //guard needed to protect copy object
    if(!userCredential?.role || !optionForm?.[userCredential.role] || (option !== "CREATE" && !id))
        return <span>There is no form suitable for your case</span>;


    /**@type {import("@/components/form/dynamicform").Field[]} */
    const fields = [];

    for(const field of optionForm[userCredential.role]){
        /**@type {import("@/components/form/dynamicform").Field} */
        let temp = field;
        
        //skip element cetrtain fields
        if(skip?.includes(temp.name))
            continue;

        // add default value for id
        if(temp.name === "id"){
            temp = Object.create(field);
            temp.default = id;
        }

        
        fields.push(temp);
    }

    return(
        <>
            <Status 
                key={STATUS_KEY_REACT}
                {...status.current}
                manual={true}
            />
            <DynamicForm 
                fields={fields}
                onSubmit={handleSubmit}
            />
        </>
    )
}