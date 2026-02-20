'use client'
import { Folder, Image } from "lucide-react";
import Link from "next/link";

export default function DriveItems({link,name}){
    
    const isFolder = typeof link === "string" && link.includes("folders");


    return(
        <Link href={link}>
            <div className="flex flex-row justify-center items-center gap-1 text-white rounded-md p-10 dark:bg-blue-400 bg-red-400 stroke-background">
                {isFolder ?
                    <><Folder/><span>{name??"folder"}</span></>
                    : 
                    <><Image/><span>{name??"file"}</span></> 
                }
            </div>
        </Link>
    )
}