"use client"
import Loader from "@/components/loading";
import handleParseResponse from "@/lib/fetch/handlefetch";
import ThemeButton from "@/components/button";

import { 
    useState, 
    useEffect, 
    useCallback,
    useRef,
} from "react";

import { 
    ArrowBigLeft, 
    ArrowBigRight,
    MoreHorizontal,
} from "lucide-react";

/**
 * @typedef {{
 *  source : URL | string
 *  label : string[]
 *  key   : string[]
 * }} Config
 */




/**
 * @param {{config: Config, title: string, fun: Function | null | undefined}} params0
 */
export default function ShowDataof({config, title, fun}){

    // store the current data
    const [data,setData] = useState(
        /**@type {({key: string, label:string, details:{}}[]) | null} */
        (null)
    );
    // store the key in object, get boolean value from that to determine show detail or not
    const [getDetails, setGetdetails] = useState(
        {}
    )

    //set the pagination setting
    const [display,setDisplay] = useState({
        page: 1,
        limit: 4,
        total : 4
    });
    
    //set the page state, loading or loaded
    const [loading, setLoading] = useState(false);
    
    //reference to heading
    const refHeading = useRef(null);

    //flip current page to next or prev;
    const pageFlipper = useCallback((sign)=>{
        sign = Math.min(1, Math.max(-1, sign));

        if(display.page * display.limit >= display.total && sign != -1)
            return;

        setDisplay(prev=>({
            ...prev,
            page: Math.max(1, prev.page+ sign),
        }))

        if(!refHeading.current) return;
        const top = refHeading.current?.getBoundingClientRect().top + window.scrollY; 
        window.scrollTo({ 
            top: top - 110,
            behavior: 'smooth' ,
        });

    }, [display]);

    useEffect(()=>{
        const controller = new AbortController();

        (async ()=>{
            setLoading(true);

            const url = new URL(config.source,globalThis?.location.origin);

            url.searchParams.set("page", display.page );
            url.searchParams.set("limit", display.limit);

            const request = new Request(url,{
                signal:controller.signal,
                method: "GET",
                headers: {
                    "content-type" : "application/json"
                }
            });

            try{
                const response = await fetch(request);
                const body = await handleParseResponse(response);

                if(!Array.isArray(body.data))
                    return;

                const [listdata, total] = body.data;

                setDisplay(prev=>({...prev,total}));
                
                /**@type {{key:string, label:string}[]} */
                const refined_listdata = listdata?.map(element=>{
                    let label = element;
                    let key = element;

                    for (const name of config.label) label = label[name]??"";
                    for (const name of config.key) key = key[name];

                    return {label,key,details:element};
                });

                setData(refined_listdata);
                

            }catch(e){
                if(e.name === "AbortError" || process.env.NODE_ENV !== "development")
                    return;
                console.error(e);

            }finally{
                setLoading(false);
            }
        })();

        return ()=>controller.abort();
    },[display.page,display.limit]);

    


    // get the item key from prev item, set it to inverse incase it is undefined or boolean
    function clicktoggleDetail(item){
        setGetdetails(prev=>({
            ...prev,
            [item.key] : !prev?.[item.key]
        }))
    }

    

    return(
        <section className=" flex flex-col gap-4 p-4 rounded-sm justify-center bg-foreground/20 items-stretch">
            <h1 className="text-3xl font-bold p-1" ref={refHeading}>{title??"List"}</h1>
            <div className="flex flex-col gap-2 p-2 justify-between items-stretch bg-black/40 rounded-sm">
                {loading && <div className="inset-0 relative flex justify-center items-center"><Loader /></div>}
                {
                    data?.map((item)=>(
                       <div
                        key={item.key}
                        onClick={() => fun?.(item)}
                        className="p-3 rounded-sm bg-black/40 text-white
                                    hover:bg-foreground/90 hover:text-background
                                    active:bg-emerald-300"
                        >
                            <div className="flex items-start gap-2">
                                <span className="flex-1 min-w-0 break-all whitespace-normal line-clamp-1">
                                    {item.label}
                                </span>

                                <MoreHorizontal
                                    onClick={(e)=>{
                                        e.stopPropagation();
                                        clicktoggleDetail(item);
                                    }}
                                    className="shrink-0 cursor-pointer"
                                />
                            </div>

                            {getDetails?.[item.key] && (
                                <GetDetails item={item.details} />
                            )}
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-row justify-around items-center">
                <div id="pagination detail">
                    <span>Page </span>
                    <span>{display.page} of {Math.ceil(display.total / display.limit)}</span>
                </div>
                
                <div className="flex flex-row gap-2">
                    <ThemeButton key={"prev button"} fun={()=>pageFlipper(-1)} text={<ArrowBigLeft/>}/>
                    <ThemeButton key={"next button"} fun={()=>pageFlipper(1)} text={<ArrowBigRight/>}/>
                </div>
            </div>
        </section>
    )
    
}

function GetDetails({ item }) {
    if (!item) return null;
    const details = [];

    if (Array.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
            let contain = item[i];
            if (contain == null) continue;

            if (typeof contain === "object") {
                contain = <GetDetails item={contain} />;
            }

            details.push(
                <div
                    key={i}
                    className="flex gap-2 items-start text-sm shrink flex-wrap border border-dotted p-1 rounded-sm md:p-5"
                >
                    <span className="text-foreground/60 min-w-8 break-all">
                        [{i}]
                    </span>
                    <div className="flex-1 break-all">
                        {contain}
                    </div>
                </div>
            );
        }
        
    }else if (typeof item === "object") {
        for (const key in item) {
            // skip id
            if (item[key] == null || key === "id") continue;

            let contain = item[key];
            if (typeof contain === "object") {
                contain = <GetDetails item={contain} />;
            }

            details.push(
                <div
                    key={key}
                    className="flex gap-2 items-start text-sm shrink flex-wrap border border-dotted p-1 rounded-sm md:p-5"
                >
                    <span className="min-w-24 break-all">
                        {key}
                    </span>
                    <span className="">:</span>
                    <div className="flex-1 break-all">
                        {contain}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="pl-3
                        flex flex-col gap-1
                        bg-foreground/5 rounded-sm">
            {details}
        </div>
    );
}