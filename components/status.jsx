"use client"
import { useContext, useEffect, useState } from "react";
import { Info, XSquareIcon} from "lucide-react"
import { motion } from "motion/react";
import { useBoundContext } from "@/context/boundary"

/**
 * 
 * @param {{message:string,code:number, manual:boolean}} param0 
 * @returns {import("react/jsx-dev-runtime").JSXSource}
 */
export default function Status({message, code, manual = false}){
    const boundary = useBoundContext();

    if(!boundary)
        return null;

    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        if(code === 0) return;
        
        setVisible(true);

        if(manual) return;

        const x = setTimeout(()=>{
            setVisible(false);
        },1500)

        return ()=>clearTimeout(x);
    },[code]);
    
    if(!visible) return <></>;

    let color = "";

    switch (Math.round(code/100)) {
        case 2:
            color = "green"
            break;
        
        case 3:
            color = "yellow";
            break;
        case 4:
        case 5:
            color = "red";
            break;
    }
    
    const colorMap = {
        green: {
            box: "border-green-300 bg-green-50",
            title: "text-green-700",
            text: "text-green-600",
            code: "text-green-400",
            stroke: "stroke-green-950"
        },
        yellow: {
            box: "border-yellow-300 bg-yellow-50",
            title: "text-yellow-700",
            text: "text-yellow-600",
            code: "text-yellow-400",
            stroke: "stroke-yellow-950"
        },
        red: {
            box: "border-red-300 bg-red-50",
            title: "text-red-700",
            text: "text-red-600",
            code: "text-red-400",
            stroke: "stroke-red-950"
        },
    };


    const messages = [];

    /**@type {{box: string, title: string, text: string, code: string, stroke:string}} */
    const c = colorMap[color] ?? colorMap.green;

    if(typeof message === "object" && message.fieldErrors){
        for(const[key,value] of Object.entries(message.fieldErrors)){
            messages.push(
                <div key={key} className="flex flex-row gap-1 justify-center items-center *:align-middle *:text-justify">
                    <h3 className={`${c.title} font-bold bg-blend-color rounded-md p-1`}>{key}</h3>
                    <div>
                        {
                            value.map((val,idx)=>(
                                <span className={`${c.text}`} key={`${value.length} + ${idx}`}>{val}</span>
                            ))
                        }
                    </div>
                </div>
            )
        }
    }
    
    return (
        <motion.div className="flex min-h-50 flex-row-reverse w-fit items-center justify-center fixed top-[20%]" drag dragMomentum={true} dragConstraints={boundary} >
            <XSquareIcon 
                className={`${colorMap.red.stroke} self-start cursor-pointer`} 
                onClick={
                    (e)=>{
                        e.stopPropagation();
                        setVisible(false);
                    }
                }
            />
            <div className={`flex flex-col justify-between items-center rounded-md border ${c.box} px-6 py-4 text-center`}>
                <Info className={`size-9 animate-pulse ${c.stroke}`}/>
                <h2 className={`text-lg font-semibold ${c.title}`}>
                    {messages.length > 1? "Messages" : "Message"}
                </h2>
                {
                    messages.length? 
                    (
                        <div className={`flex gap-1 flex-col mt-1.5 *:${c.text}`}>
                            {messages}
                        </div>
                    ) :
                    (
                        <p className={`mt-2 text-sm ${c.text}`}>
                            {typeof message === "string"? message : "no message"}
                        </p>
                    )
                }
                
                <span className={`mt-1 block text-xs ${c.code}`}>
                    code: {code}
                </span>
            </div>
        </motion.div>
    );
   
}