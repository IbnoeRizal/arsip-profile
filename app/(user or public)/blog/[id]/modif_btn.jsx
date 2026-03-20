'use client'
import {
    Pencil,
    Trash2Icon
} from "lucide-react"
import { useRouter } from "next/navigation";
import { useCallback } from "react";
/**
 * @param {{id:string, editable:boolean}} param0 
 * @returns {import("react").JSX.Element}
 */
export function ModifGroupBtn({ id, editable }) {
    const router = useRouter();
   
    const callback = useCallback((option)=>{
        if(!["UPDATE","DELETE"].includes(option)) return;

        return router.push(`/post?id=${id}&option=${option}`);
    }, [id]);

    if (!editable) return null;
    return (
        <div className="size-fit flex flex-row gap-3 flex-nowrap *:p-3 *:rounded-[50%] *:size-10 *:cursor-pointer absolute right-0">
            <button 
                className="bg-green-600 flex items-center hover:bg-green-950"
                onClick={()=>callback("UPDATE")}
            >
                <Pencil className="stroke-white">
                </Pencil>
            </button>
            <button 
                className="bg-red-600 flex items-center hover:bg-red-950"
                onClick={()=>callback("DELETE")}
            >
                <Trash2Icon className="stroke-white">
                </Trash2Icon>
            </button>
        </div>

    )
}