"use client"
import { motion } from "motion/react";
import { BookMarkedIcon } from "lucide-react"
export function Boxinfo(props){
    const infos = props.infos;
    return (
        <div className="container bg-background brightness-95 dark:brightness-150 rounded-md p-2 flex-row">
            {infos.length && infos.map((x)=>(
                <div key={x.id} className="flex items-start gap-2 mt-1">
                    <BookMarkedIcon size={20} className="shrink-0 dark:stroke-blue-400 stroke-red-400"></BookMarkedIcon>
                    <p className="text-base wrap-break-word font-medium">{x.info}</p>
                </div>
            ))}
        </div>
    );
}