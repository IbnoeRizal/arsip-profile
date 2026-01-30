'use client'
import { createContext,useRef } from "react";
import Navbar from "@/components/navbar";

export const BoundContext = createContext(null);

export function BoundaryProvider({children}){
    const refboundary = useRef(null);

    return(
        <div ref={refboundary} className="">
            <Navbar links={["/karyawan"]}/>
            <BoundContext.Provider value={refboundary}>
                {children}
            </BoundContext.Provider>
        </div>
    )

}
