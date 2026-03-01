'use client'
import { ForwardRefEditor } from "@/components/editor/ForwardRefEditor";
import { useKeyboardPresece } from "@/customHooks/keyboard_detector";
import { useEffect, useRef, useState } from "react";
import { 
    Save,
    Send,
    Download 
} from "lucide-react";

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
    const editorRef = useRef(null);
    const name = "finalMd";

    const setEditorRef = (instance) => {
        if (instance) {
            editorRef.current = instance;
            load();
        } else {
            if (editorRef.current) {
                save(); // autosave sebelum hilang
            }
            editorRef.current = null;
        }
    };

    function send(){
        let finalMd;
        if(!editorRef.current || !(finalMd = editorRef.current.getMarkdown().trim())){
            return alert("system error, Editor or Content is missing");
        }

        if(window.confirm("Data akan dikirimkan, apakah anda yakin")){
            alert(finalMd);
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
    }

    return(
    <>
        <section className={`mx-4 max-w-full flex flex-col justify-around items-center`}>
            <h1 className="mb-4 text-4xl text-left w-full font-bold">Menambahkan Halaman</h1>
            <p>
                Gunakan editor di bawah untuk membuat halaman baru.
                Halaman baru dapat dikelompokkan berdasarkan kelas, mata pelajaran, atau penulis secara opsional. 
            </p>
        </section>
        <section className="mt-20 mx-4 max-w-full flex flex-col justify-around items-center">
            <h2 className="mb-4 text-3xl text-left w-full font-bold" >Editor</h2>
            <div className="max-w-full bg-foreground/10 rounded-md self-stretch items-stretch flex justify-stretch *:w-full">
                <ForwardRefEditor ref={setEditorRef}/>
            </div>
            <div className="flex flex-row self-end justify-center items-center *:grow-0 *:shrink-0 gap-2 mt-2">
                <button type="button" id="send" onClick={send} className="bg-foreground/10 p-2 rounded-md flex flex-row justify-evenly gap-2 items-center active:bg-background/10">Send <Send className="dark:stroke-blue-500 stroke-red-500"/></button>
            </div>
        </section>
        <section className={`mt-20 mx-4 max-w-full flex flex-col justify-around items-centers not-first:gap-10 ${!hasKeyboard ? `invisible`:``}`}>
            <h2 className="mb-4 text-3xl text-left w-full font-bold" >Shortcut</h2>
            {
                Object.entries(shortcut).map(([key,value],idx)=>(
                    <p key={key} className="flex flex-col justify-between items-start">
                
                        <em className="font-bold text-2xl p-2 rounded-md bg-foreground/10">{`${idx+1}. ${key}`}</em>
                        <br />
                        <b className="font-bold">
                            {value[keyword[0]]}
                        </b>
                        <br />
                        {value[keyword[1]]}
                    </p>
                ))
            }
        </section>
    </>
    )
}