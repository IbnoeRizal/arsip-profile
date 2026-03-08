"use client"
import  {SHOW_CONFIG, ShowDataof} from "@/components/dataShow/show_label_key";
import { useState } from "react";
import { XSquare } from "lucide-react";
import ThemeButton from "@/components/button";
import Lazysegment from "@/components/lazysegment";
import { useEffect } from "react";

export default function Page(){
    useEffect(() => {
        window.scrollTo({
        top: 0,
        behavior: "instant"
        });
    }, []);

    return (
        <div className="flex flex-col mt-20 divide-y divide-foreground/20 min-h-full no-anchor">
            {Object.values(SHOW_CONFIG).map((item) => (
                <div key={item.TITLE} className="py-8 min-w-90">
                    <Lazysegment>
                        <Segment {...item} />
                    </Lazysegment>
                </div>
            ))}
        </div>
    )    
}

/**
 * @typedef {typeof SHOW_CONFIG} ShowConfigType
 */

/**
 * @typedef {ShowConfigType[keyof ShowConfigType]["FORM"]} FormType
 */

/**
 * 
 * @param {{
 *      SHOW:{key:string[], labe:string[], source: string},
 *      FORM: FormType
 *      TITLE: string
 *      TABLENAME: string
 * }} param0 
 */
function Segment({ SHOW, FORM: Form, TITLE, TABLENAME }) {
    const [selected, setSelect] = useState(null);
    const [modeForm, setModeForm] = useState("CREATE");

    function handleMode(mode) {
        if((selected && mode === "CREATE") || (!selected && mode !== "CREATE")) return;
        setModeForm(mode);
    }

    function handleSelect(data){
        setSelect(prev=>{
            if(data === prev) return null;
            return data;
        });
        
        if(data && modeForm === "CREATE" ){
            setModeForm("UPDATE")
            return;
        }

        if((!data && modeForm !== "CREATE") || selected === data){
            setModeForm("CREATE")
            return;
        }
    }

    return (
        <section className="flex flex-col gap-4 p-4 rounded-md bg-foreground/10">
    
            {/* ===== Selected Info (di atas, full width) ===== */}
            {selected && (
                <div className="flex items-center justify-between
                                p-3 rounded-md
                                bg-green-400/40">
                    <span className="truncate max-w-[80%]">
                        {selected.label}
                    </span>
                    <XSquare
                        className="stroke-red-500 shrink-0 cursor-pointer"
                        onClick={() => handleSelect(null)}
                    />
                </div>
            )}

            {/* ===== Grid Area ===== */}
            <div className="grid md:grid-cols-2 gap-6 *:min-w-80">
                
                {/* List */}
                <div className="flex flex-col gap-3">
                    <ShowDataof
                        fun={handleSelect}
                        config={SHOW}
                        title={TITLE}
                        tablename={TABLENAME}
                    />
                </div>

                {/* Form */}
                <div className="flex flex-col gap-3 p-3 rounded-md bg-black/20">
                    <div className="flex gap-2 justify-center sticky top-0">
                        <div 
                            className={`
                                size-fit 
                                rounded-md 
                                [&>button]:rounded-md ${modeForm === 'CREATE' ? '[&>button]:bg-black [&>button]:text-white' : ''}`
                        }>
                            <ThemeButton text="CREATE" fun={() => handleMode("CREATE")} />
                        </div>
                        <div 
                            className={`
                                size-fit 
                                rounded-md 
                                [&>button]:rounded-md ${modeForm === 'UPDATE' ? '[&>button]:bg-black [&>button]:text-white' : ''}`
                        }>
                            <ThemeButton text="UPDATE" fun={() => handleMode("UPDATE")} />
                        </div>
                        <div 
                            className={`
                                size-fit 
                                rounded-md 
                                [&>button]:rounded-md ${modeForm === 'DELETE' ? '[&>button]:bg-black [&>button]:text-white' : ''}`
                        }>
                            <ThemeButton text="DELETE" fun={() => handleMode("DELETE")} />
                        </div>
                    </div>

                    <div className="p-2 rounded-md bg-black/10">
                        <Form id={selected?.key??''} option={modeForm} default={selected?.details}/>
                    </div>
                </div>
            </div>
        </section>
    );
}