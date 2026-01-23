import { motion } from "motion/react";
import { DotSquare } from "lucide-react"
export function Boxinfo(props){
    const infos = props.infos;
    return (
        <> 
            {infos.length && infos.map((x)=>(
                <motion.div key={x.id}>
                    <DotSquare color="red" size={10}></DotSquare>
                    <div>{x.info}</div>
                </motion.div>
            ))}
        </>
    )
}