"use client"

import { useEffect, useState, Suspense, useRef } from "react";
import ProfilePic from "@/components/profilepic";
import ThemeButton from "@/components/button";
import { ArrowBigRight, ArrowBigLeft } from "lucide-react";
import Status from "@/components/status";

export default function Karyawan(props) {
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

    const status = useRef({
        message:"",
        code: 0
    });

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
    useEffect(() => {
        async function getKaryawan() {
            const res = await fetch(`/api/user/?page=${display.page}&limit=${display.limit}`);
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
        }
        getKaryawan();

    }, [display.page]);

    return (
        <div className="flex flex-col justify-center items-center mt-20">
            <Status {...status.current}/>
            <div className="w-fit self-end flex flex-row justify-end text-white sticky top-1 z-0 gap-2 *:cursor-pointer">
                <ThemeButton fun={handlePrev} text={(<ArrowBigLeft></ArrowBigLeft>)}/>
                <ThemeButton fun={handleNext} text={(<ArrowBigRight></ArrowBigRight>)}/>
            </div>
            <div className="container flex flex-col gap-4 p-2 *:rounded-md dark:*:hover:border-blue-200 *:hover:border-red-200 *:border-background *:border">
                {data.users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center flex-row bg-inherit gap-2"
                    >
                        <ProfilePic id={user.id}/>
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