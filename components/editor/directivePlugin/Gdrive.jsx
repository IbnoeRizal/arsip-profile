'use client'
import {
    usePublisher,
    useMdastNodeUpdater,
    insertDirective$,
} from "@mdxeditor/editor";
import { FolderClosed } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {SHOW_CONFIG,ShowDataof} from "@/components/dataShow/show_label_key";
import { createPortal } from "react-dom";
import { Riframe } from "@/components/resizableiframe";


/**
 * @type {import('@mdxeditor/editor').DirectiveDescriptor}
 */
const GdriveDirectiveDescriptor = {
    name: 'gdrive',
    type: 'leafDirective',
    testNode(node) {
        return node.name === 'gdrive'
    },
    attributes: ['id'],
    hasChildren: false,
    Editor: ({ mdastNode }) => {
        const refer = useRef(null);
        const updateNode = useMdastNodeUpdater()


        useEffect(()=>{
        const observer = new ResizeObserver(([entry])=>{
            
            const width = Math.round(entry.contentRect.width).toString();
            
            
            if(mdastNode.attributes?.width !== width) {
            updateNode(
                {
                    ...mdastNode,
                    attributes:{
                        ...mdastNode.attributes,
                        width
                    }
                    }
                )
                }
            });

            if(refer.current){
                observer.observe(refer.current);
            }

        return ()=>observer.disconnect()
        },[])

        return (
            <Riframe 
                sizeref={refer}
                src={`/api/school/driveObj/${mdastNode?.attributes?.id}`}
                props={{
                    allowFullScreen:true
                }}
            />
        )
    }
}

const toggle = Object.freeze({
    button : "search",
    search : "button",
    /**
     * @param {string} val 
     * @returns {string}
     */
    swap   : function (val){
        if(!val) return this.search;
        val = val.trim();
        return this[val] ?? this.search;
    }
})

const GdriveButton = () => {
    const insertDirective = usePublisher(insertDirective$);
    const [state,setState] = useState(toggle.swap(""));
    const myConfig = {...SHOW_CONFIG.DriveObj.SHOW, source:SHOW_CONFIG.DriveObj.SHOW.source+"/me"};
    const driveconfig = {...SHOW_CONFIG.DriveObj}

    return(
    <>
        { state === toggle.search ? 
            <div 
                className="w-fit p-1 rounded-md"
                onClick={
                    e=>{
                        e.stopPropagation(); 
                        setState(prev=>toggle.swap(prev))
                    }
                }
            ><FolderClosed/></div>:
            createPortal(
                <div className="inset-0 fixed bg-black/90 flex flex-col justify-center items-center"
                    onClick={(e)=>{
                        e.target === e.currentTarget && setState(prev=>toggle.swap(prev));
                    }}
                >
                    <div className="size-fit bg-white/40 max-h-screen overflow-y-auto">
                        <ShowDataof config={myConfig} tablename={driveconfig.TABLENAME} title={driveconfig.TITLE} fun={data=>{
                            insertDirective({
                                name: "gdrive",
                                type: "leafDirective",
                                attributes: {id: data.key}
                            })
                            setState(prev=>toggle.swap(prev));
                        }} />
                    </div>
                </div>
            ,document.body)
        }
    </>
    )
}

export{
    GdriveButton,
    GdriveDirectiveDescriptor
}