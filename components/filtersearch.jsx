"use client"
import J from "@/generated/prisma/indexedSchema.json"
import DynamicForm from "@/components/form/dynamicform/dynamicform";
import { useState } from "react";

import { userConfig } from "./form/userCUD";
import { Prisma } from "@/generated/prisma/browser";
import { driveConfig } from "./form/driveObjCUD";
import { jabatanConfig } from "./form/jabatanCUD";
import { kelasConfig } from "./form/kelasCUD";
import { mapelConfig } from "./form/mapelCUD";
import { mengajarConfig } from "./form/mengajarCUD";
import { misiConfig } from "./form/misiCUD";
import { visiConfig } from "./form/visiCUD";

/** 
 * filter configuration from all form jsx
 * @param {object} king - verified obj from generated json
 * @param {import("@/components/form/dynamicform/dynamicform").Field} slave -field from form configuration
 * @returns {import("@/components/form/dynamicform/dynamicform").Field} - verified obj with form configuration
 */
function filterConfig(king, slave){
    const result = {};
    for(const k in king){
        if(Object.hasOwn(slave, k)){
            result[k] = {...slave[k], ["name"] : k, ["required"]: false}
        }
    }
    
    return result;
}

/**@type {Readonly<Record<string,import("@/components/form/dynamicform/dynamicform").Field>>} */
const grouping = Object.freeze({
    [Prisma.ModelName.User] : userConfig,
    [Prisma.ModelName.DriveObj] : driveConfig,
    [Prisma.ModelName.Jabatan] : jabatanConfig,
    [Prisma.ModelName.Kelas] : kelasConfig,
    [Prisma.ModelName.Mapel] : mapelConfig,
    [Prisma.ModelName.Mengajar] : mengajarConfig,
    [Prisma.ModelName.Visi] : visiConfig,
    [Prisma.ModelName.Misi] : misiConfig,
})

/**@type {Readonly<Record<string,import("@/components/form/dynamicform/dynamicform").Field>>} */
const filterCONFIG = globalThis.filterCONFIG ?? (function(){
    const temp = {};
    for(const tablename in J){
        temp[tablename] = Object.freeze(filterConfig(J[tablename],grouping[tablename]))
    }

    if(process.env.NODE_ENV !== "production") globalThis.filterCONFIG = temp;

    return temp;

})();

export function Filterdata({tableName,callback}){
    const arr = Object.values(filterCONFIG[tableName]).map(x=>x);
    const [visible, setVisible] = useState(false);

    return(
        <search className="flex justify-center items-center">
            {visible ? 
                <DynamicForm fields={arr} onSubmit={data=>{callback?.(data); setVisible(false)}} compact={true}/>:
                <div 
                    className="flex justify-center items-center p-2 border-dotted border rounded-lg w-full cursor-pointer" 
                    onClick={()=>setVisible(true)}
                >
                Filter
                </div>
            }
        </search>
    )

}