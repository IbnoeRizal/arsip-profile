"use client";

import Image from "next/image";
import {motion} from "motion/react"
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <> 
      <Navbar links={["/about", "/contact"]}/>
      <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} className="backdrop-blur-3xl">
        <h1 className="text-4xl font-bold text-center mt-20">SDN 2 Gedog</h1>
      </motion.div>
    </>
  );
}
