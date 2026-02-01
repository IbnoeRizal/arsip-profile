'use client'
import { Role,Prisma } from "@/generated/prisma/browser";
import { useEffect, useRef, useState } from "react";
import Loader from "../loading";
import DynamicForm from "./dynamicform";
import schemaToFields from "@/lib/schemaToFields";
import Status from "../status";
import { USER_CREATE_BY_ADMIN, USER_DELETE_BY_ADMIN, USER_PATCH_BY_ADMIN, USER_PATCH_BY_USER } from "@/lib/authschema";
import { useCredential } from "@/context/usercredential";

/**@type {{ [key: string]: import("./dynamicform").Field }}  */
const userConfig = Object.preventExtensions({
    name:{
        label:"Nama",
        type:"text" ,
        parse: String,
    },

    email:{
        label: "Email",
        type:"email",
        parse: String,
    },

    bio:{
        label: "Bio",
        as: "textarea",
        parse: String,
    },

    role:{
        label: "Role",
        as:"select",
        options: Object.entries(Role).map(([label,value])=>({label,value})),
        parse : String,
    },


    jabatanId:{
        label: "Jabatan",
        as:"select",
        parse: String,
        source: {
            url : "/api/school/Jabatan/",
            getlabel: ["title"],
            getvalue: ["id"]
        }
    },

    password:{
        label: "Password",
        type: "password",
        parse: String
    }
});


const STATUS_KEY_REACT = "user_cud";


//check config, throw if doesn't match prismaschema

const {id,createdAt,updatedAt,...userfields} = Prisma.UserScalarFieldEnum;
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

export function UserCUD({option,id}){
    const userCredential = useCredential();
    const [optionform,setOptionform] = useState(REFINED_FIELDS[option]??null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        message: "",
        code: 0
    })

    const controller = useRef(null);

    async function handlesubmit(data){
        
        let {URL,METHOD} = REQUEST_MODE[option];

        if(METHOD === "PATCH")
            URL = URL.replace("[id]",id);

        setLoading(true);

        controller.current?.abort();
        controller.current = new AbortController();

        console.table(data);
        const request = new Request(URL,{
            body:JSON.stringify(data),
            method:METHOD,
            headers:{
                "Content-Type" : "application/json"
            },
            signal:controller.current.signal,
        });

        try{
            const data = await fetch(request);
            const body = await data.json();

            setData({
                message: data.ok ? data.statusText : body.data,
                code: data.status
            });
        }catch(err){

            if(err.name !== "AbortError")
                console.error(err);

            setData(prev=>({

            }))
        }finally{
            setLoading(false);
        }
        
    }

    useEffect(()=>{
        setOptionform(REFINED_FIELDS[option]??null);
        return ()=>controller.current?.abort();
    },[data.code,option])

   if(loading)
        return <span><h3>loading</h3><Loader/></span>;

   if(!userCredential?.role || !optionform || (option === "UPDATE" && !id))
        return <span>There is no form suitable for your case</span>;

   return(
        <>
            <Status 
                key={STATUS_KEY_REACT} 
                code={data.code} 
                message={data.message}
                manual={true}
            />
            <DynamicForm 
                fields={optionform?.[userCredential.role]}
                onSubmit={handlesubmit}
            />
        </>
   )
}