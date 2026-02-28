"use client"
import  {SHOW_CONFIG, ShowDataof} from "@/components/dataShow/show_label_key";
import { useState } from "react";
import { XSquare } from "lucide-react";
import ThemeButton from "@/components/button";
import Lazysegment from "@/components/lazysegment";
import { useEffect } from "react";
import { SHOW_CONFIG } from "@/components/dataShow/show_label_key";

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
                <div key={item.TITLE} className="py-8">
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
        if (!selected) {
            setModeForm("CREATE");
            return;
        }
        setModeForm(mode);
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
                        onClick={() => setSelect(null)}
                    />
                </div>
            )}

            {/* ===== Grid Area ===== */}
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* List */}
                <div className="flex flex-col gap-3">
                    <ShowDataof
                        fun={(x) => setSelect(x)}
                        config={SHOW}
                        title={TITLE}
                        tablename={TABLENAME}
                    />
                </div>

                {/* Form */}
                <div className="flex flex-col gap-3 p-3 rounded-md bg-black/20">
                    <div className="flex gap-2 justify-center">
                        <ThemeButton text="CREATE" fun={() => handleMode("CREATE")} />
                        <ThemeButton text="UPDATE" fun={() => handleMode("UPDATE")} />
                        <ThemeButton text="DELETE" fun={() => handleMode("DELETE")} />
                    </div>

                    <div className="p-2 rounded-md bg-black/10">
                        <Form id={selected?.key} option={modeForm} />
                    </div>
                </div>
            </div>
        </section>
    );
}