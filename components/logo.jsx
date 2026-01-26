"use client"
import { motion } from "motion/react";
import Image from "next/image";

export function Logo(props){
    return(
        <>
            <motion.div
                initial={{scale: 3, opacity:0}}
                animate={{scale: 1, opacity:1}}
                transition={{duration:0.2}}
                whileHover={{scale: 1.6 }}
            >
                <Image
                src="/Logo-Sekolah.svg"
                alt="Logo Sekolah"
                width={props.width??80}
                height={props.height??80}
                priority
                />
            </motion.div>
        </>
    )
}