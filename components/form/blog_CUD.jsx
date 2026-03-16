//@ts-check
'use client'
import { Prisma, $Enums } from "@/generated/prisma/browser";
import schemaToFields from "@/lib/schemaToFields";
import { 
    CLIENT_BLOG_CREATE, 
    BLOG_DELETE, 
    BLOG_UPDATE_BY_ADMIN, 
    BLOG_UPDATE_BY_USER
}from "@/lib/authschema";
import { sourceOfTruth } from "../dataShow/sourceEndpoint";
import { MergeDynaform } from "@/components/form/dynamicform/mergerform";
import { ForwardRefEditor } from "@/components/editor/ForwardRefEditor";
import { 
    useState,
    useCallback,
    useRef,
    useMemo,
    useEffect,

} from "react";
import { upload } from "@vercel/blob/client";
import { UploadProgress } from "@/components/progressbar";
import handleParseResponse from "@/lib/fetch/handlefetch";

/**
 * configuration needed to safely parse schema to fields
 */
/**@type { Readonly<Record<string, import("@/components/form/dynamicform/dynamicform").Field>> }  */
export const blogConfig = Object.preventExtensions({
    [Prisma.BlogScalarFieldEnum.id]: {
        type:"hidden",
        as: "input",
        parse: String,
    },

    [Prisma.BlogScalarFieldEnum.nama]: {
        as:"input",
        label:"Nama Blog",
        parse: String,
    },

    // [Prisma.BlogScalarFieldEnum.link]: {
    //     label : "Link",
    //     as: "input",
    //     type: "url",
    //     parse: String,
    // },

    [Prisma.BlogScalarFieldEnum.idUser]: {
        label : "Penulis",
        as: "select",
        source : {
            getlabel: sourceOfTruth.User.label,
            getvalue: sourceOfTruth.User.key,
            url: sourceOfTruth.User.source
        }
    },

    [Prisma.BlogScalarFieldEnum.idKelas]: {
        label : "Kelas",
        as:"select",
        source: {
            getlabel: sourceOfTruth.Kelas.label,
            getvalue: sourceOfTruth.Kelas.key,
            url: sourceOfTruth.Kelas.source
        }
    },

    [Prisma.BlogScalarFieldEnum.idMapel]: {
        label: "Mapel",
        as: "select",
        source: {
            getlabel: sourceOfTruth.Mapel.label,
            getvalue: sourceOfTruth.Mapel.key,
            url: sourceOfTruth.Mapel.source
        }
    },

    [Prisma.BlogScalarFieldEnum.eTag]: {
        label:"eTag",
        type:"hidden",
        as:"input"
    }
});



const STATUS_KEY_REACT = "blog_cud";

const {createdAt,updatedAt,link, ...blogItems} = Prisma.BlogScalarFieldEnum;

//verification
for(const item in blogItems){
    if(blogConfig[item])continue;

    throw new Error("blogConfig doesn't match database schema \n"+item)
}

const REFINED_FIELDS = Object.freeze({
    CREATE: Object.freeze({
        ADMIN : schemaToFields(CLIENT_BLOG_CREATE,blogConfig),
        USER : schemaToFields(CLIENT_BLOG_CREATE,blogConfig)

    }),

    UPDATE: Object.freeze({
        ADMIN : schemaToFields(BLOG_UPDATE_BY_ADMIN,blogConfig),
        USER  : schemaToFields(BLOG_UPDATE_BY_USER,blogConfig),
    }),

    DELETE: Object.freeze({
        ADMIN : schemaToFields(BLOG_DELETE,blogConfig),
        USER : schemaToFields(BLOG_DELETE,blogConfig),
    })
});

// request mode define url and method needed to fetch data to server
const REQUEST_MODE = Object.freeze({
    CREATE : Object.freeze({
        URL : "/api/school/post/",
        METHOD : "POST"
    }),

    UPDATE : Object.freeze({
        URL : "/api/school/post/[id]",
        METHOD : "POST",
    }),

    DELETE : Object.freeze({
        URL : "/api/school/post/",
        METHOD : "DELETE"
    })
})

/**
 * @param {{
 *      option   : "CREATE" | "UPDATE" | "DELETE", 
 *      id       : string, 
 *      skip?    : Prisma.BlogScalarFieldEnum[]
 *      fun?     : Function
 *      default? : Record<Prisma.BlogScalarFieldEnum,string|number>
 * }} param0 
 * 
 * @returns {import("react").JSX.Element}
 */
export function BlogCUD({option,id,skip,fun,default:defaultData}){

    //mulai
        const [upProgres,setUpProgres] = useState(
        /**
         * @type {{loaded:number,total:number,percentage:number} | null}
         */
        (null)
    )
    const editorRef = useRef(null);
    const name = "finalMd";

    const setEditorRef = useCallback((instance) => {
        if (instance) {
            editorRef.current = instance;
            load();
        } else {
            if (editorRef.current) {
                save();
            }
            editorRef.current = null;
        }
    },[]);

    useEffect(()=>{
        if(option !== "UPDATE" || !id) {
    
            editorRef.current?.setMarkdown?.("");
            return;
        };

        const controller = new AbortController();
        try{
            
            fetch(`${sourceOfTruth.Blog.source}/${id}`,{signal:controller.signal}).then(x=>x.text()).then(x=>{
                editorRef.current?.setMarkdown?.(x);
            });
        }catch(err){
            if(err.name === "AbortError")
                return;
            console.log(err);
        }

        return ()=>controller.abort();
    },[option,id]);
    /**
     * 
     * @param {Record<string,string>} data 
     * @param {string} url
     * @param {"POST" | "PATCH" | "DELETE"} method
     * @param {AbortSignal} signal
     * @param {{info?:import("react").RefObject<{message:string,code:number}>,loading?:Function }} params
     * @returns {Promise<void>}
     */
    async function send(data,url,method,signal,{info=undefined,loading=undefined}={}){
        if(!window.confirm("Data akan dikirimkan, apakah anda yakin"))
            return;
        
        try{
            loading?.();
            setUpProgres({loaded:0,total:0,percentage:0});

            switch (method) {
                case "POST":
                case "PATCH":
                    let finalMd;
                    if(!editorRef.current || !(finalMd = editorRef.current.getMarkdown().trim())){ 
                        if(info){
                            info.current.message = "Data tidak ada";
                            info.current.code = 404;
                        }
                        return;
                    }

                    const blob = new Blob([finalMd],{type:"text/markdown"});

                    const result = await upload(defaultData?.nama ?? `${data.nama}.md`,blob,{
                        access:"public",
                        handleUploadUrl: url,
                        abortSignal: signal,
                        onUploadProgress:(obj)=>setUpProgres(prev=>({...prev,...obj})),
                        clientPayload:JSON.stringify(data),
                    });

                    if(info){
                        info.current.message = "berhasil";
                        info.current.code = 200;
                    }

                    break;
                case "DELETE":
                    const res = await fetch(url,{
                        method,
                        body:JSON.stringify(data)
                    });

                    const body = await handleParseResponse(res);

                    if(info){
                        info.current.message = body.data ?? (String(body).length < 100 ? body : null) ?? res.statusText;
                        info.current.code = res.status;
                    }
                    break;
            }

        }catch(err){
            if (process.env.NODE_ENV === "development" && err.name !== "AbortError")
                console.error(err);
                
            
        }finally{
            setUpProgres(null);
            loading?.();
        }
    };

    function save(){
        if(!editorRef.current) return;

        const finalMd = editorRef.current.getMarkdown();
        sessionStorage.setItem(name, finalMd);
    };

    function load(){
        if(!editorRef.current) return;
        const data = sessionStorage.getItem(name);
        if(!data) return;
        editorRef.current.setMarkdown(data);
    };
    //selesai
 
    return(
        <MergeDynaform 
            id={id} 
            option={option} 
            skip={skip}
            REFINED_FIELDS={REFINED_FIELDS}
            REQUEST_MODE={REQUEST_MODE}
            STATUS_KEY_REACT={STATUS_KEY_REACT}
            fun={fun}
            default={defaultData}
            handleself={send}
        >
            {!!upProgres && <UploadProgress upProgres={upProgres}/>}
            {(option === "CREATE" || option === "UPDATE") &&
                <div className="w-full bg-foreground/5 rounded-lg border border-foreground/10">
                    <ForwardRefEditor ref={setEditorRef} readOnly={!!upProgres}  />
                </div>
            }
        </MergeDynaform>
    )
}
