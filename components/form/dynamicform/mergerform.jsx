'use client'

import DynamicForm from "@/components/form/dynamicform/dynamicform";
import { useCredential } from "@/context/usercredential";
import { useEffect, useRef, useState } from "react";
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
 * }} param0 
 * @returns {import("react").JSX.Element}
 */
export function MergeDynaform({ option, id, skip, REFINED_FIELDS, REQUEST_MODE, STATUS_KEY_REACT, fun, default:defaultData = {}}) {
    const userCredential = useCredential();
    const [optionForm, setOptionForm] = useState(REFINED_FIELDS[option] ?? null);
    const [isLoading, setLoading] = useState(false);
    const status = useRef({
        message: "",
        code: 0
    })

    const controller = useRef(null);
    useEffect(() => {
        setOptionForm(REFINED_FIELDS[option] ?? null)
    }, [option, userCredential.id, userCredential.role, id])

    async function handleSubmit(data) {
        setLoading(true);
        controller.current?.abort();
        controller.current = new AbortController();

        let { URL, METHOD } = REQUEST_MODE[option] ?? REQUEST_MODE.CREATE;
        URL = URL.replace("[id]", id);


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


    //guard needed to protect copy object
    if (!userCredential?.role || !optionForm?.[userCredential.role] || (option !== "CREATE" && !id))
        return <span>There is no form suitable for your case</span>;


    /**@type {import("@/components/form/dynamicform/dynamicform").Field[]} */
    const fields = [];

    for (const field of optionForm[userCredential.role]) {
        /**@type {import("@/components/form/dynamicform/dynamicform").Field} */
        let temp = field;

        //skip element cetrtain fields
        if (skip?.includes(temp.name)){
            temp.type = "hidden"
        }

        // add default value for id
        if (temp.name === "id") {
            temp = Object.create(field);
            temp.default = id;
        }else if(defaultData[temp.name]){
            temp = {...temp, default:defaultData[temp.name]};
        }


        fields.push(temp);
    }

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
            />
        </>
    )
}