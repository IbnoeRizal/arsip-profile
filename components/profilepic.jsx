"use client"
import { useEffect, useRef, useState } from "react";
import { UserCircle2Icon } from "lucide-react"
import handleParseResponse from "@/lib/fetch/handlefetch";


export default function ProfilePic({id,w=300,h=300,fun}){
    const [data, setData] = useState({
        text: "",
        code: 0
    });

    const controller = useRef(null);

    useEffect(()=>{
        let mounted = true;
        controller.current = new AbortController();

        async function getProfile() {
            
            try{
                const response = await fetch("/api/school/driveObj/"+id+"/profilepic",{signal:controller.current.signal});
                const result = await handleParseResponse(response);
                
                if(!mounted) return;
                
                fun?.(result?.data.id ?? "");
                setData({
                    text: result?.data.link ?? "",
                    code: response.status,
                })     
            }catch(e){
                if(e.name !== "AbortError" && process.env.NODE_ENV === "development")
                    console.error(e);
            }     
        }

        getProfile();

        return ()=>{
            mounted = false;
            controller.current?.abort()
        };
    },[id,fun]);

  
    return(
        <div className="rounded-full overflow-hidden shrink-0 ring-1 dark:ring-blue-300 ring-black/10" style={{width:w, height:h}}>
            {data.code/100 < 3 && data.text !== ""?
                <img src={data.text} className="w-full h-full object-cover" alt="profile" onError={()=>setData(prev=>({...prev,text:""}))}></img>: 
                <UserCircle2Icon className="mask-circle dark:stroke-blue-300 w-full" style={{width:w, height:h}}/>
            }
        </div>
    )  
}