"use client"
import ShowDataof from "./_components/show_label_key";
import { useState } from "react";
import { XSquare } from "lucide-react";
import ThemeButton from "@/components/button";
import Lazysegment from "@/components/lazysegment";
import { UserCUD } from "@/components/form/userCUD";
import { DriveObjCUD } from "@/components/form/driveObjCUD";
import { JabatanCUD } from "@/components/form/jabatanCUD";
import { KelasCUD } from "@/components/form/kelasCUD";
import { MapelCUD } from "@/components/form/mapelCUD";
import { MengajarCUD } from "@/components/form/mengajarCUD";
import { VisiCUD } from "@/components/form/visiCUD";
import { useEffect } from "react";
import { MisiCUD } from "@/components/form/misiCUD";
import { Prisma } from "@/generated/prisma/browser"

const SHOW_CONFIG = Object.freeze([
    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["name"],
            source: "/api/user",
        }),
        FORM: UserCUD,
        TITLE: "List User",
        TABLENAME: Prisma.ModelName.User

    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["vision"],
            source: "/api/school/visi",
        }),
        FORM: VisiCUD,
        TITLE: "List Visi",
        TABLENAME: Prisma.ModelName.Visi
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["mision"],
            source: "/api/school/misi",
        }),
        FORM: MisiCUD,
        TITLE: "List Misi",
        TABLENAME: Prisma.ModelName.Misi
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["link"],
            source: "/api/school/driveObj",
        }),
        FORM: DriveObjCUD,
        TITLE: "List File ",
        TABLENAME: Prisma.ModelName.DriveObj
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["title"],
            source: "/api/school/Jabatan",
        }),
        FORM: JabatanCUD,
        TITLE: "List Jabatan ",
        TABLENAME: Prisma.ModelName.Jabatan
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["nama"],
            source: "/api/school/kelas",
        }),
        FORM: KelasCUD,
        TITLE: "List Kelas ",
        TABLENAME: Prisma.ModelName.Kelas
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["nama"],
            source: "/api/school/mapel",
        }),
        FORM: MapelCUD,
        TITLE: "List mapel ",
        TABLENAME: Prisma.ModelName.Mapel
    }),

    Object.freeze({
        SHOW : Object.freeze({
            key:["id"],
            label:["user","name"],
            source: "/api/school/mengajar",
        }),
        FORM: MengajarCUD,
        TITLE: "List mengajar ",
        TABLENAME: Prisma.ModelName.Mengajar
    }),
    
])

export default function Page(){
    useEffect(() => {
        window.scrollTo({
        top: 0,
        behavior: "instant"
        });
    }, []);

    return (
        <div className="flex flex-col mt-20 divide-y divide-foreground/20 min-h-full no-anchor">
            {SHOW_CONFIG.map((item) => (
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
 * 
 * @param {{
 *      SHOW:{key:string[], labe:string[], source: string},
 *      FORM: UserCUD | DriveObjCUD,
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