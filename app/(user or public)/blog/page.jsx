'use client'

import { Filterdata } from "@/components/filtersearch";
import { sourceOfTruth } from "@/components/dataShow/sourceEndpoint";
import { Prisma } from "@/generated/prisma/browser";
import { ElapsedTDate } from "@/lib/elapsedDate";
import ThemeButton from "@/components/button";
import { 
    useCallback,
    useEffect,
    useState 
} from "react"
import { 
    ArrowBigRight,
    ArrowBigLeft
} from "lucide-react";
import { 
    usePathname, 
    useRouter
} from "next/navigation";

export default function page(){
    const [pagination,setPagination] = useState({
        page:1,
        limit:20,
        total:20
    });
    const location = usePathname();
    const router = useRouter();
    const [filter,setFilter] = useState({});
    const [data,setData] = useState([]);

    useEffect(()=>{
        const controller = new AbortController();
        const {total,...pages} = pagination;
        fetchData(controller,{...pages,...filter}).then(
            res=>{
                return res ? res.json() : null
            }
        ).then(newData=>{
            if(newData?.data && Array.isArray(newData.data)){
                setPagination(prev =>{
                    const newlimiter = prev;
                    
                    if(newlimiter.limit > newData.data[1]){
                        newlimiter.limit = newData.data[1];
                        return newlimiter;
                    }

                    newlimiter.limit = 20;
                    return newlimiter;
                });
                setData(newData.data[0]);
            }
        })
        return ()=>controller.abort();        
    },[pagination.page,filter]);

    const filCalback = useCallback((data)=>setFilter(data), []);

    const flipCalback =  useCallback((sign)=>{
        sign = Math.min(1,Math.max(sign,-1));
        setPagination(prev=>{
            const maxPage = Math.floor(prev.total/prev.limit);
            const newPage = prev.page + sign;

            if(newPage > maxPage || newPage === 0) return prev;
            return {...prev,page:newPage};
        })

    },[pagination.page,pagination.limit])

    return (
        <section className="min-h-[50vh] flex flex-col justify-start items-center min-w-78.75">
            <h1 className="text-5xl font-bold align-middle inline-block">Blog Post</h1>

            <div className="self-stretch m-3">
                <Filterdata callback={filCalback} tableName={Prisma.ModelName.Blog}/>
            </div>
            <div className="self-baseline-last flex flex-row gap-2 justify-evenly items-center sticky top-5 size-fit">
                <ThemeButton fun={()=>flipCalback(-1)} text={<ArrowBigLeft/>}/>
                <ThemeButton fun={()=>flipCalback(+1)} text={<ArrowBigRight/>}/>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
                {data?.map(member => {

                    const date = new ElapsedTDate(member.updatedAt);
                    return (
                        <div
                            key={member.id}
                            className="flex flex-col gap-4 border border-border/30 hover:border-border/60 rounded-xl p-5 bg-background hover:border-red-600 dark:hover:border-blue-600 active:bg-foreground"
                            onClick={()=>router.push(location+"/"+member.id)}
                        >
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 w-fit">
                            {member?.mapel?.nama}
                            </span>

                            <h2 className="text-xl font-bold leading-snug">
                                {String(member.nama).split("-")[0].toUpperCase()}
                            </h2>

                            <hr className="border-border/20" />

                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Penulis</span>
                                    <span className="text-sm font-medium">{member?.user?.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Kelas</span>
                                    <span className="text-sm font-medium">{member?.kelas?.nama}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs">Mapel</span>
                                    <span className="text-sm font-medium">{member?.mapel?.nama}</span>
                                </div>
                                <div className="self-end p-3 rounded-md bg-red-600/10 dark:bg-blue-600/20">
                                    <span className="text-sm block">{date.getFormatedDate()}</span>
                                    <span className="text-[10px] italic block">{date.getDescriptionElapsedTime()}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
  
    )
}

/**
 * @param {AbortController?} controller 
 * @param {Record<string,string>?} filter 
 * 
 * @returns {Promise<Response?>}
 */
async function fetchData(controller,filter) {
    try {
        const url = new URL(sourceOfTruth.Blog.source,window.location.origin);

        if(typeof filter === "object"){
            for (const param in filter){
                url.searchParams.append(param, filter[param]);
            }
        }

        const res = await fetch(url,{
            signal:controller?.signal
        });
        
        
        return res;
        
        
    } catch (err) {
        if(err !== "AbortError"){
            console.log(err);
        }

    }

    return null;
}