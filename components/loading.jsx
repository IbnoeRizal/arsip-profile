'use client'
import { motion } from "motion/react";

export default function Loader(){
    return (
        <svg width="120" height="20" className="dark:stroke-blue-300 stroke-red-300">
            {[0, 1, 2].map((i) => (
                <motion.circle
                key={i}
                cx={20 + i * 40}
                cy={10}
                r={6}
                fill="currentColor"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                }}
                />
            ))}
        </svg>
    )
}