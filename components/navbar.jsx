"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import {motion, useMotionValueEvent, useScroll} from "motion/react";

export default function Navbar(props) {
  const{scrollY} = useScroll();
  const[dirscroll,setDirScroll] = useState("up");

  const timeoutRef = useRef(null);

  useMotionValueEvent(scrollY,"change",(current)=>{
    const prev = scrollY.getPrevious() ?? current;
    const diff = current - prev;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(()=>{
      setDirScroll(diff > 0 ? "down":"up");
    },100)
  })


  return (
    <motion.nav className="w-full dark:bg-blue-600 bg-red-600 p-3 fixed top-0 left-0 z-1" animate={{y:dirscroll==="down"? "-100%" : "0"}} transition={{duration:0.25, ease:"easeOut"}}>
      <div className="flex container mx-auto flex-nowrap">
        <Link href="/" className="text-white text-xl font-bold cursor-pointer">
          Home
        </Link>
        {props.links && props.links.map((link) => (
            <Link key={link} href={link}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration :0}}
                    className="text-white text-base font-bold ml-4 dark:bg-blue-950 bg-red-950 p-2 rounded-md inline-block cursor-pointer"
                >
                {link.split("/").at(-1)}
                </motion.div>
            </Link>
        ))}
      </div>
    </motion.nav>
  );
}