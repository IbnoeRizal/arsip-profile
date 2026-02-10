import { useEffect, useRef, useState} from "react";
import { motion } from "motion/react";

export default function Lazysegment({children}){
    const [visible,setvisible] = useState(false);
    const reference = useRef(null);
    useEffect(()=>{
        if(!reference.current)return;
        const observer = new IntersectionObserver(([entry])=>{
            if(entry.isIntersecting){
                setvisible(true);
                observer.disconnect();
            }

        },{
            threshold: 1,
            delay: 50
        })

        observer.observe(reference.current);

        return()=>observer.disconnect();
    },[])

    return (
        <div ref={reference}>
            {visible ? 
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    viewport={{ amount: 0.1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {children}
                </motion.div>:
                <div className="h-[50vh]"></div>
            }
        </div>
    )
}