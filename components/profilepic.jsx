"use client"
import { useEffect, useState } from "react";
import { UserCircle2Icon } from "lucide-react"


export default function ProfilePic({id,w=300,h=300}){
    const [data, setData] = useState({
        text: "",
        code: 0
    });

    useEffect(()=>{
        async function getProfile() {
            const response = await fetch("/api/school/driveObj/"+id);
            const result = await response.json();
            setData({
                text: result.data,
                code: response.status,
            })           
        }

        getProfile();
    },[id]);

  
    return(
        <div className="rounded-full overflow-hidden shrink-0 ring-1 dark:ring-blue-300 ring-black/10" style={{width:w, height:h}}>
            {data.code/100 < 3 && data.text !== ""?
                <img src={data.text} className="w-full h-full object-cover" alt="profile"></img>: 
                <UserCircle2Icon className="mask-circle dark:stroke-blue-300" style={{width:w, height:h}}/>
            }
        </div>
    )  
}