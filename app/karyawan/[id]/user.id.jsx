"use client"

import Status from "@/components/status";
import { useEffect, useRef, useState } from "react"
import ProfilePic from "@/components/profilepic";
import Loading from "./loading";
import { useCredential } from "@/context/usercredential";
import ThemeButton from "@/components/button";
import {UserPenIcon}from "lucide-react"
import { usePathname, useRouter } from "next/navigation";

export default function GetUserInfo({id}){

    const [data,setData] = useState({
        name:"",
        email:"",
        bio:"",
        jabatan:{title:""},
        mengajar:[
            {
                kelas:{nama:""},
                mapel:{nama:""}
            },
        ],
    });

    const status = useRef({
        message:"",
        code:0
    });

    const [isLoading,setLoading] = useState(true);

    useEffect(()=>{
        const controller = new AbortController();
        const request = new Request("/api/user/"+id,
            {
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                },
                signal:controller.signal
            }
        );

        /**
         * @param {Request} request 
         * @returns
         */
        async function sendId(request) {
            try{
                setLoading(true);
                const result = await fetch(request);
                const body = await result.json();

                if(result.ok){
                    status.current.message = result.statusText;
                    status.current.code = result.status;
                    setData(body.data);
                }else{
                    status.current.message = body.data;
                    status.current.code = result.status;
                }
            }catch(e){
                if(e.name !== "AbortError")
                    console.error(e);
            }finally{
                setLoading(false);
            }
        }
        sendId(request);
    
        return ()=>controller.abort();
    },[id]);

    if(isLoading)
        return(
            <Loading/>
        )

    return(
        <>
            <Status {...(status?.current)}/>
            <User  id={id} {...data}/>
        </>
    )
}

/**
 * 
 * @param {{
 *  id:string,
 *  name:string,
 *  email:string,
 *  bio:string | null,
 *  jabatan:{
 *      title:string
 *  } | null,
 *  mengajar:
 *   {
 *      kelas:{nama:string},
 *      mapel:{nama:string}
 *   }[]
 * 
 * }}param0 
 * 
 * @returns {import("react").JSX.Element}
 */
function User({id,name,email,bio,jabatan,mengajar}){
    const route = useRouter();
    const path = usePathname();
    const userCredential = useCredential();
    const can_edit = userCredential?.id === id || userCredential?.role === "ADMIN";
    return (
        <>
        <div
            key={id}
            className="w-full bg-white dark:bg-background rounded-2xl p-6 flex flex-col md:flex-row gap-8"
            >
            
            <div className="flex justify-center md:w-1/4">
                <div className="size-fit flex grow-o last:items-end">
                    <ProfilePic id={id} h={200} w={200}/>
                    <div className="flex flex-row grow-0 items-end justify-center">
                        {can_edit && <ThemeButton text={<UserPenIcon width={20} height={20}/>} fun={()=>route.push(path+"/edit")}/>} 
                    </div>
                </div>
            </div>

           
            <div
                id="identity"
                className="flex flex-col gap-4 md:w-2/4"
                >
            <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                Nama
                </span>
                <span className="text-lg font-semibold">
                {name}
                </span>
            </div>

            <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                Email
                </span>
                <span className="text-sm break-all">
                {email}
                </span>
            </div>

            <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                Jabatan
                </span>
                <span className="text-sm">
                {jabatan?.title ?? "Belum Menjabat"}
                </span>
            </div>

            <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wide text-slate-500">
                Bio
                </span>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {bio ?? "Belum ada Bio"}
                </p>
            </div>
            </div>

            <div
                id="mengajar"
                className="md:w-1/4 flex flex-col gap-3"
                >
            <span className="text-xs uppercase tracking-wide text-slate-500">
                Mengajar
            </span>

            {mengajar.length === 0 && (
                <p className="text-sm text-slate-400">
                Belum ada data mengajar
                </p>
            )}

            {mengajar.map(({ kelas, mapel }) => (
                <div
                key={`${kelas.nama}-${mapel.nama}`}
                className="border border-slate-200 dark:border-slate-700
                rounded-lg p-3
                hover:bg-slate-50 dark:hover:bg-slate-800
                transition-colors"
                >
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Kelas</span>
                    <span className="font-medium">{kelas.nama}</span>
                </div>

                <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-500">Mapel</span>
                    <span className="font-medium">{mapel.nama}</span>
                </div>
                </div>
            ))}
            </div>
        </div>
        </>
    );

}