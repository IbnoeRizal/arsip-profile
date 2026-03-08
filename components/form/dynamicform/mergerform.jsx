'use client'

import DynamicForm from "@/components/form/dynamicform/dynamicform";
import { useCredential } from "@/context/usercredential";
import { useEffect, useMemo, useRef, useState } from "react";
import Status from "@/components/status";
import handleParseResponse from "@/lib/fetch/handlefetch";
import Loader from "@/components/loading";


/**
 * 
 * @param {{
 *      option: object, 
 *      id: string, 
 *      REFINED_FIELDS: object, 
 *      REQUEST_MODE:object, 
 *      STATUS_KEY_REACT:string
 *      fun : Function | null | undefined
 *      default?: Record<string,string|number>
 *      handleself?:Function
 *      children?:import("react").ReactNode
 * }} param0 
 * @returns {import("react").JSX.Element}
 */
export function MergeDynaform({ 
    option, 
    id, 
    skip, 
    REFINED_FIELDS, 
    REQUEST_MODE, 
    STATUS_KEY_REACT, 
    fun, 
    default:defaultData = {},
    handleself,
    children
}) {
    const userCredential = useCredential();
    const [isLoading, setLoading] = useState(false);
    const status = useRef({
        message: "",
        code: 0
    })
    
    const controller = useRef(null);
    
    async function handleSubmit(data) {
        controller.current?.abort();
        controller.current = new AbortController();
        
        let { URL, METHOD } = REQUEST_MODE[option] ?? REQUEST_MODE.CREATE;
        URL = URL.replace("[id]", id);
        
        // if handled by caller
        if(handleself){
            await handleself(data,URL,METHOD,controller.current.signal,{info:status, loading:()=>setLoading(p=>!p)});
            return;
        }
        setLoading(true);
        
        const request = new Request(URL, {
            body: JSON.stringify(data),
            method: METHOD,
            headers: {
                "content-type": "application/json"
            },
            signal: controller.current.signal
        });
        
        
        try {
            const response = await fetch(request);
            const body = await handleParseResponse(response);
            
            status.current.message = body.data ?? (String(body).length < 100 ? body : null) ?? response.statusText;
            status.current.code = response.status;
            
            if(response.ok)
                fun?.(body.data);
            
        } catch (err) {
            if (process.env.NODE_ENV === "development" && err.name !== "AbortError")
                console.error(err);
            
        } finally {
            setLoading(false);
        }
        
    }

    const optionForm = useMemo(()=>{
        return REFINED_FIELDS[option] ?? null;  
    },[REFINED_FIELDS, option, userCredential.role])
    
    /**@type {import("@/components/form/dynamicform/dynamicform").Field[]} */
    const fields = useMemo(()=>{
        const result = [];

        if (!optionForm?.[userCredential.role]) return result;

        for (const field of optionForm[userCredential.role]) {
            /**@type {import("@/components/form/dynamicform/dynamicform").Field} */
            let temp = field;
    
            //skip element cetrtain fields
            if (skip?.includes(temp.name)){
                temp = {...temp,type:"hidden"};
            }
    
            // add default value for id
            if (temp.name === "id") {
                if(temp == field){
                    temp = {...temp};
                }

                temp.default = id;
            }else if(defaultData[temp.name]){
                temp = {...temp, default:defaultData[temp.name]};
            }
    
    
            result.push(temp);
        }

        return result;

    }, [optionForm, userCredential.role, userCredential.id , id, defaultData, skip])

    //guard needed to protect copy object
    if (!userCredential?.role || !optionForm || (option !== "CREATE" && !id))
        return <span>There is no form suitable for your case</span>;


    return (
        <>
            <Status
                key={STATUS_KEY_REACT}
                {...status.current}
                manual={true}
            />
            {isLoading && <span className="flex flex-row justify-center items-center"><Loader /></span>}
            <DynamicForm
                fields={fields}
                onSubmit={handleSubmit}
            >
                {children}
            </DynamicForm>
        </>
    )
}