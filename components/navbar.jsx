"use client";
import React from "react";
import Link from "next/link";
import {motion} from "motion/react";

export default function Navbar(props) {

  return (
    <nav className="bg-blue-600 p-3 ">
      <div className="container mx-auto">
        <Link href="/" className="text-white text-xl font-bold cursor-pointer">
          Home
        </Link>
        {props.links && props.links.map((link) => (
            <Link key={link} href={link}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration :0}}
                    className="text-white text-base font-bold ml-4 bg-blue-950 p-2 rounded-md inline-block cursor-pointer"
                >
                {link.split("/").at(-1)}
                </motion.div>
            </Link>
        ))}
      </div>
    </nav>
  );
}