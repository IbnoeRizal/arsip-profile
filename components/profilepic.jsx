"use client"
import { useEffect, useState } from "react";
import { UserCircle2Icon } from "lucide-react"


export default function ProfilePic({id}){
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

    if(data.code/100 < 3 && data.text !== "")
        return(
            <img src={data.text} className="mask-circle flex-none" alt="profile"></img>
        )
    
    return(
        <UserCircle2Icon className="mask-circle dark:stroke-blue-300"/>
    )
}