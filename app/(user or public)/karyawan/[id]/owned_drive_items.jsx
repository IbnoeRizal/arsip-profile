"use client"
import DriveItems from "@/components/driveItem";
import { useRef, useState } from "react";
import { DriveObjCUD } from "@/components/form/driveObjCUD";
import { useRouter } from "next/navigation";
import ThemeButton from "@/components/button";
import { 
    PlusSquare,
    Pencil,
    XSquare,
} from "lucide-react";

/** fungsi untuk mengatur edit dan delete item driveObj
 * 
 * @param {{items:Object[], userId:string}} param0 -array objek drive dan userId
 * @returns {import("react").JSX.Element} 
 */
export default function ContainerDriveItems({items,userId}){
    const [timer,setTimer] = useState(
        /**@type {Record<string,Date> | {}} */
        ({})
    );
    const [option,setOption] = useState("")
    const [idTarget, setTarget] = useState(null);
    const router = useRouter();

    function clickItems(event,obj){
        event.preventDefault();
        const id = String(obj.id)

        if(["mouseup","touchend"].includes(event?.type ?? "")){
            if(!timer[id]) return;

            //clear timeout
            clearTimeout(timer[id]);

            //remove timeout id
            setTimer(prev=>({
                ...prev,
                [id] : undefined
            }));


            // target click because timer is still running
            const link = event.currentTarget.querySelector('a')?.href
            if(link)
                router.push(link);
            
            return;
        }

        const x = setTimeout(()=>{

            setTarget(id);
            setOption("UPDATE")

            //remove timeout id
            setTimer(prev=>({
                ...prev,
                [id] : undefined
            }));

        },1000);

        setTimer(prev=>({
            ...prev,
            [id] : x
        }))
    };

    return(
        <div className="container self-center sm:grid sm:grid-cols-3 sm:place-content-center sm:place-items-center-stretch flex justify-center items-center flex-wrap gap-4 border border-dotted sm:p-5 rounded-md *:hover:brightness-90">
            {(option || idTarget) && 
                <div className="

                    fixed 
                    inset-1
                  bg-black/70
                    flex flex-col 
                    gap-1 
                    justify-center 
                    items-center
                    text-white
                    font-bold
                    " 
                    onClick={()=>{
                        setTarget(null);
                        setOption("")
                    }}
                    >
                    
                    <div
                        onClick={e=>e.stopPropagation()}
                        className="size-65 flex flex-col justify-start gap-3 items-center bg-foreground/10 p-1 rounded-md"
                    >
                        {["UPDATE","DELETE"].includes(option) && 
                            <div className="flex flex-row justify-around gap-2 items-center bg-black/15 rounded-md *:p-2 w-full *:shrink-0">
                                <div 
                                    className="flex flex-col justify-center items-center rounded-sm" 
                                    style={{background : option === "UPDATE"? "black" : undefined}}
                                    onClick={()=>setOption("UPDATE")} 
                                    >
                                    <Pencil/>
                                    <span>Update</span>
                                </div>
                                <div 
                                    className="flex flex-col justify-center items-center rounded-sm"
                                    style={{background : option === "DELETE"? "black" : undefined}}
                                    onClick={()=>setOption("DELETE")}
                                    >
                                    <XSquare className="stroke-red-500"/>
                                    <span>Delete</span>
                                </div>
                            </div>
                        }
                        <h1 className="text-white" >{option ?? ""}</h1>
                        <div className="size-fit bg-black/15 p-2 rounded-md min-w-20">
                            <DriveObjCUD id={idTarget} option={option} skip={["userId", "category"]} default={{userId:userId}} fun={(x)=>router.refresh()}/>
                        </div>
                    </div>
                        
                </div>
            }
            <>
                {
                    items?.map((obj) => (
                        <div  
                            key={obj.id} 
                            onMouseUp={(event)=>clickItems(event,obj)} 
                            onMouseDown={(event)=>clickItems(event,obj)}
                            onTouchStart={(event)=>clickItems(event,obj)}
                            onTouchEnd={(event)=>clickItems(event,obj)}
                            onClick={event=>event.preventDefault()}
                        >
                            <DriveItems {...obj}/>
                        </div>
                    ))
                }
                <div 
                    className="flex bg-foreground justify-center items-center p-10 rounded-md"
                    onClick={()=>{
                        setOption("CREATE");
                    }}
                >
                    <PlusSquare className="stroke-emerald-300 stroke-2"/>
                </div>
            </>
        </div>
    )
}
