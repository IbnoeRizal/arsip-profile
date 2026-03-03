'use client'
import { ForwardRefEditor } from "@/components/editor/ForwardRefEditor";
import { useKeyboardPresece } from "@/customHooks/keyboard_detector";
import { useCallback, useRef, useState } from "react";
import { Send } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { mengajarConfig } from "@/components/form/CUD_global"
import { CreateModalSelector } from "@/components/form/dynamicform/dynamicform";
import { Prisma } from "@/generated/prisma/browser";
import { UploadProgress } from "@/components/progressbar";

const keyword = ["kegunaan","contoh pemakaian"];

const shortcut = Object.freeze({
    ["#"] : Object.freeze({
        [keyword[0]] : "untuk memberikan efek heading level 1 sampai 6",
        [keyword[1]] : "ketik # diikuti dengan spasi, tambahkan ## agar level naik, semakin besar nilai level maka heading semakin kecil"
    }),
    ["* atau -"] : Object.freeze({
        [keyword[0]] : "untuk membuat list point",
        [keyword[1]] : "ketik * atau - diikuti dengan spasi, tekan enter lagi untuk menghilangkan efek pada baris selanjutnya"
    }),
    [">"] : Object.freeze({
        [keyword[0]] : "untuk memberikan efek quotes",
        [keyword[1]] : "ketik > diikuti dengan spasi kemudian tulis quotes"
    }),
    ["Ctrl + (B, I, U)"] : Object.freeze({
        [keyword[0]] : "untuk memberikan efek tebal, italic,atau garis bawah",
        [keyword[1]] : "ketik Ctrl diikuti dengan pilih salah satu B (tebal) atau I(italic) atau U(garis bawah) sebelum mengetik, atau pilih teks terlebih dahulu"
    }),
    ["Ctrl + k"] : Object.freeze({
        [keyword[0]] : "untuk memberikan url pada teks yang dipilih",
        [keyword[1]] : "pilih teks lalu tekan keyword Ctrl + k"
    }),
    // ["```(bahasa pemrograman)"] : Object.freeze({
    //     [keyword[0]] : "untuk menambahkan block yang dapat menampilkan bahasa pemrograman pada editor",
    //     [keyword[1]] : "ketik ``` diikuti dengan mengganti (bahasa pemrograman) dengan nama bahasa yang diinginkan"
    // }),
})

export default function page(){
    const hasKeyboard = useKeyboardPresece();

    return(
    <>
        <section className="mx-4 max-w-full flex flex-col gap-3 justify-around items-center">
            <h1 className="mb-2 text-4xl text-left w-full font-bold">Menambahkan Halaman</h1>
            <p className="text-foreground/70 text-sm leading-relaxed w-full">
                Gunakan editor di bawah untuk membuat halaman baru.
                Halaman baru dapat dikelompokkan berdasarkan kelas, mata pelajaran, atau penulis secara opsional.
            </p>
        </section>

        <section className="mt-16 mx-4 max-w-full flex flex-col gap-4 justify-around items-center">
            <h2 className="text-3xl text-left w-full font-bold">Editor</h2>
            <div className="max-w-full self-stretch flex flex-col items-stretch *:w-full">
                <BlogEditor/>
            </div>
        </section>

        <section className={`mt-16 mx-4 max-w-full flex flex-col gap-6 justify-around items-center ${!hasKeyboard ? 'invisible' : ''}`}>
            <h2 className="text-3xl text-left w-full font-bold">Shortcut</h2>
            {
                Object.entries(shortcut).map(([key,value],idx)=>(
                    <div key={key} className="w-full flex flex-col gap-2 p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                        <em className="font-bold text-lg px-2 py-1 rounded-md bg-foreground/10 self-start not-italic">
                            {`${idx+1}. ${key}`}
                        </em>
                        <b className="font-semibold text-sm text-foreground/80">
                            {value[keyword[0]]}
                        </b>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                            {value[keyword[1]]}
                        </p>
                    </div>
                ))
            }
        </section>
    </>
    )
}

function BlogEditor(){
    const [upProgres,setUpProgres] = useState(
        /**
         * @type {{loaded:number,total:number,percentage:number} | null}
         */
        (null)
    )

    const blogIdentity = Object.freeze(["blogName", Prisma.MengajarScalarFieldEnum.idMapel, Prisma.MengajarScalarFieldEnum.idKelas]);
    const [identifier,setIdentifier] = useState(Object.fromEntries(blogIdentity.map(v=>[v,null])));

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

    const signal = useRef(null);
    function send(){
        let finalMd;
        if(!editorRef.current || !(finalMd = editorRef.current.getMarkdown().trim())){
            return alert("system error, Editor or Content is missing");
        }
        if(!window.confirm("Data akan dikirimkan, apakah anda yakin"))
            return;

        signal.current?.abort();
        signal.current = new AbortController;

        async function uploadBlog(blob) {
            setUpProgres({loaded:0,total:0,percentage:0})
            try{
                const data = await upload(`${identifier.blogName ?? "draft"}.md`,blob,
                    {
                        access:"public",
                        handleUploadUrl: "/api/school/post",
                        abortSignal:signal.current.signal,
                        onUploadProgress:(obj)=>setUpProgres(prev=>({...prev,...obj})),
                        clientPayload:JSON.stringify(identifier)
                    }
                )

                alert("berhasil terkirim");
            }catch(err){
                if (process.env.NODE_ENV === "development" && err.name !== "AbortError")
                console.error(err);
                
                alert("gagal mengirim")
            }finally{
                setUpProgres(null);
            }
        }

        const blob = new Blob([finalMd],{type:"text/markdown"});
        uploadBlog(blob);
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

    function handleIdentifier(data){
        setIdentifier(prev=>({
            ...prev,
            [data.name] : data.target?.value ?? null
        }));
    }

    return(
    <div className="flex flex-col gap-4 w-full">

        <div id="blogidentifier" className="w-full rounded-lg border border-foreground/10 overflow-visible">
            <form action="#" className="flex flex-col divide-y divide-foreground/10">
                {blogIdentity.map((k)=>{
                    const arr = [];
                    arr.push(
                        <label htmlFor={k} className="text-sm font-medium text-foreground/60 w-1/3 shrink-0 flex items-center px-3">
                            {k}
                        </label>
                    );

                    if(k.startsWith("id")){
                        arr.push(
                            <div className="flex-1 py-1 px-2">
                                <CreateModalSelector
                                    callback={(field,target)=>handleIdentifier({...field,...target})}
                                    field={{
                                        name:k,
                                        source:mengajarConfig[k]?.source,
                                        required: false
                                    }}
                                    compact={true}
                                />
                            </div>
                        )
                    }else{
                        arr.push(
                            <input
                                type="text"
                                name={k}
                                onChange={(data)=>handleIdentifier({name:data.target.name,...data})}
                                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/30 focus:bg-foreground/5"
                            />
                        )
                    }

                    return (
                        <div key={k} className="flex flex-row items-stretch min-h-10">
                            {...arr}
                        </div>
                    )
                })}
            </form>
        </div>

        {!!upProgres && <UploadProgress upProgres={upProgres}/>}
        <div className="w-full bg-foreground/5 rounded-lg border border-foreground/10">
            <ForwardRefEditor ref={setEditorRef} readOnly={!!upProgres} />
        </div>

        <div className="flex flex-row justify-end items-center gap-2">
            <button
                type="button"
                id="send"
                onClick={send}
                className="flex flex-row items-center gap-2 px-4 py-2 rounded-lg bg-foreground/10 hover:bg-foreground/15 active:bg-foreground/20 transition-colors text-sm font-medium shrink-0"
            >
                Send
                <Send size={16} className="dark:stroke-blue-500 stroke-red-500 shrink-0"/>
            </button>
        </div>

    </div>
    )
}