"use client"
import { useEffect, useRef, useState } from "react";
import { UserCircle2Icon } from "lucide-react"
import handleParseResponse from "@/lib/fetch/handlefetch";

const colorPallet = {
    ERROR : {
        stroke : "stroke-red-900"
    },

    OK : {
        stroke : "dark:stroke-blue-300"
    }
}


export default function ProfilePic({id,w=300,h=300,fun}){
    const [data, setData] = useState({
        text: "",
        code: 0
    });

    const [isError, setError] = useState("Ok");

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
                
                const drivePicture = (()=>{
                    //get id file from googledrive file
                    let original = String(result?.data.link);
                    if(!(original.includes("drive.google.com")))
                        return null;

                    const url = new URL(original);
                    const parts = url.pathname.split("/");
                    const d_index = parts.indexOf("d");
                    return d_index !== -1 ? `https://drive.google.com/thumbnail?id=${parts[d_index + 1]}` : null;
                })();
                if(drivePicture)
                    console.log(drivePicture);

                setData({
                    text: drivePicture ?? result?.data.link ?? "",
                    code: response.status,
                })     

                setError(response.statusText)
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

    const c = colorPallet[isError]?.stroke ?? colorPallet["ERROR"].stroke;
    
    return(
        <div className="rounded-full overflow-hidden shrink-0 ring-1 dark:ring-blue-300 ring-black/10" style={{width:w, height:h}}>
            {data.code/100 < 3 && data.text !== ""?
                <img 
                    src={data.text} 
                    className="w-full h-full object-cover" 
                    alt="profile" 
                    onError={()=>{
                            setData(prev=>({...prev,text:""}))
                            setError("ERROR")
                        }}
                    loading="lazy"
                ></img>: 
                <UserCircle2Icon className={`mask-circle ${c} w-full`} style={{width:w, height:h}}/>
            }
        </div>
    )  
}