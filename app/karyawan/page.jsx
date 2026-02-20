"use client"

import { useEffect, useState, Suspense, useRef } from "react";
import ProfilePic from "@/components/profilepic";
import ThemeButton from "@/components/button";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";
import Status from "@/components/status";
import Loader from "@/components/loading";
import { usePathname, useRouter } from "next/navigation";
import { Filterdata } from "@/components/filtersearch";
import { Prisma } from "@/generated/prisma/browser";

export default function Karyawan(props) {
    const router = useRouter();
    const pathname = usePathname();

    const [display, setDisplay] = useState({
        page: 1,
        limit: 15
    });
    const [data, setData] = useState({
        /**
         * @type {[{id:string, name:string, jabatan:{title:string}}]}
         */
        users: [],
        total: 0
    });

    const [filter,setFilter] = useState({});

    const status = useRef({
        message:"",
        code: 0
    });

    const [loading, setLoading] = useState(true);

    function handleNext(e) {
        e.stopPropagation();
        if (display.page * display.limit < data.total)
            setDisplay(prev => (
                { ...prev, page: prev.page + 1 }
            ));
    }

    function handlePrev(e) {
        e.stopPropagation();
        if (display.page * display.limit > display.limit)
            setDisplay(prev => (
                { ...prev, page: prev.page - 1 }
            ));
    }

    /**
     * @param {string} id 
     */
    function userId(id){
        router.push(pathname+"/"+id);
    }

    useEffect(() => {
        const controller = new AbortController();
        async function getKaryawan() {
            try{
                setLoading(true)
                const url = new URL(`/api/user/?page=${display.page}&limit=${display.limit}`,window.location.origin)
                if(filter){
                    console.log('ini filternya')
                    console.log(filter)
                    for(const param in filter){
                        url.searchParams.set(param, filter[param]);
                    }
                }
                const request = new Request( 
                    url,
                    {
                        method:"GET",
                        signal:controller.signal,
                    }
                );
                const res = await fetch(request);
                const result = await res.json();
    
                if (res.ok && Array.isArray(result?.data)) {
                    setData(prev => ({
                        ...prev,
                        users: result.data[0],
                        total: result.data[1]
                    }));
                    status.current.message = res.statusText;
                    status.current.code = res.status;
                } else {
                    status.current.message = result.data;
                    status.current.code = res.status;
                }

            }catch(e){
                if (e.name !== "AbortError") console.error(e);
            }finally{
                setLoading(false);
            }
        }
        getKaryawan();

        return () => controller.abort();
    }, [display.page, filter]);

    if(loading)
        return(
            <div className="fixed inset-0 flex items-center justify-center">
                <Status {...status.current}/>
                <Loader/>
            </div>
        )

    return (
        <div className="flex flex-col justify-center items-center mt-20">
            <Status {...status.current}/>
            <div className="container flex flex-col items-stretch">
                <Filterdata callback={(x)=>setFilter(x)} tableName={Prisma.ModelName.User}/>
            </div>
            <div className="w-fit self-end flex flex-row justify-end text-white sticky top-1 z-0 gap-2 *:cursor-pointer">
                <ThemeButton fun={handlePrev} text={(<ArrowBigLeft></ArrowBigLeft>)}/>
                <ThemeButton fun={handleNext} text={(<ArrowBigRight></ArrowBigRight>)}/>
            </div>
            <div className="container flex flex-col gap-4 p-2 *:rounded-md dark:*:hover:border-blue-200 *:hover:border-red-200 *:border-background *:border">
                {data.users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center flex-row bg-inherit gap-2 active:dark:bg-blue-400 active:bg-red-400"
                        onClick={()=>userId(user.id)}
                    >
                        <ProfilePic id={user.id} w={35} h={35}/>
                        <div className="flex justify-between flex-1">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">Nama</span>
                                <span>{user.name}</span>
                            </div>

                            <div className="flex flex-col text-right">
                                <span className="text-sm text-gray-500">Jabatan</span>
                                <span>{user.jabatan?.title}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}