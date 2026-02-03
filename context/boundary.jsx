'use client'
import { createContext,useRef,useContext } from "react";
import Navbar from "@/components/navbar";

const BoundContext = createContext(null);

export const useBoundContext = function(){
    const ctx = useContext(BoundContext);
    if(!ctx)
        throw new Error("useBoundContext must be used inside BoundaryProvider");
    return ctx;
}

export function BoundaryProvider({children}){
    const ctx = useContext(BoundContext);
    const refboundary = useRef(null);
    if(ctx)
        return(<>
            {children}
        </>)


    return(
        <div ref={refboundary} className="">
            <Navbar links={["/karyawan"]}/>
            <BoundContext.Provider value={refboundary}>
                {children}
            </BoundContext.Provider>
        </div>
    )

}
