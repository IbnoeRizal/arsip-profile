'use client'

import { useCallback, useState } from "react"
import { useCredential } from "@/context/usercredential"
import Login from "@/components/form/login"
import { 
    LogInIcon,
    XCircle
 } from "lucide-react"
import { useBoundContext } from "@/context/boundary"
import { motion } from "motion/react"

export default function LoginUser(){
    const [isOpen,setIsOpen] = useState(false);
    const user = useCredential();
    const boundary = useBoundContext();

    if(user.id) return null;

    return(
        <>
             
            <div 
                className=" rounded-md p-2 flex-row justify-center content-center bg-red-950 dark:bg-blue-950 *:stroke-white"
                onClick={()=>{setIsOpen(prev=>!prev)}}
            >
                {
                    !isOpen? <LogInIcon/>:<XCircle/>
                }
            </div>
            
            
            {isOpen && <motion.div className="fixed inset-0 size-fit m-auto" drag dragConstraints={boundary}>
                <Login/>
            </motion.div>}
        </>
    )
}