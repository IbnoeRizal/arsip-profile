"use client"
import { useEffect } from "react";

export default function Err({message, code}){
    useEffect(()=>{},[message,code]);

    return (
        <div className="flex min-h-[200px] w-full items-center justify-center">
            <div className="rounded-md border border-red-300 bg-red-50 px-6 py-4 text-center">
                <h2 className="text-lg font-semibold text-red-700">
                    Terjadi Kesalahan
                </h2>
                <p className="mt-2 text-sm text-red-600">
                    {message}
                </p>
                <span className="mt-1 block text-xs text-red-400">
                    Error code: {code}
                </span>
            </div>
        </div>
    );
}