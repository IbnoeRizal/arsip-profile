'use client'
import { useKeyboardPresece } from "@/customHooks/keyboard_detector";
import { BlogCUD } from "@/components/form/blog_CUD";
import { useCredential } from "@/context/usercredential";
import { useSearchParams } from "next/navigation";

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
    const credential = useCredential();
    const searchParams = useSearchParams();

    const params = {
        id: searchParams.get("id"),
        option : searchParams.get("option"),
    }
    

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
                <BlogCUD 
                    id={params.id} 
                    skip={["link", "idUser"]} 
                    default={{nama:"draft", idUser:credential.id}} 
                    option={params.option ?? "CREATE"}
                />
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
