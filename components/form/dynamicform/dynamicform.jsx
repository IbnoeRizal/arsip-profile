"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ThemeButton from "@/components/button";
import { 
  ArrowLeftCircleIcon, 
  ArrowRightCircleIcon,
  Trash2Icon,
} from "lucide-react";

/**
 * @typedef {{
 *  label: string
 *  name: string
 *  type?: import("react").HTMLInputTypeAttribute
 *  as?: "input" | "select" | "textarea" | "massInput"
 *  options?: { label: string, value: string | number }[]
 *  parse?: (value:any)=>any,
 *  required?: boolean,
 *  default? :any
 *  source?: {
 *    url:string | URL,
 *    getlabel: string[],
 *    getvalue: string[],
 *  }
 * }} Field
 */

/**
 * @param {Field['source']} source 
 * @param {AbortSignal | null | undefined} signal
 * @returns {Promise<{options:{label:string,value:string | number}[],total}>}
 */
async function getOption(source,signal){
  const options = [];
  let total;
  try{
    const result = await fetch(source.url,{signal:signal});
    const data = (await result.json()).data;
    
    if(result.ok){
      const ref = data?.length >=2 && !isNaN(data[1]) ? data[0] : data;
      total = data[1] ?? ref.length;

      for(let i = 0 ; i < ref.length; ++i){
        let label = ref[i];
        let value = ref[i];

        for(let key of source.getlabel)label = label[key];
        for(const val of source.getvalue) value = value[val];

        options[i] = {
          label,value
        }

      }

    }
    
  }catch(err){
    if(err !== "AbortError" && process.env.NODE_ENV === "development")
      console.error(err);
  }finally{
    return {
      options,
      total : total ?? options.length
    };
  }
}

/**
 * @param {{
 *  fields: Field[]
 *  onSubmit?: (data:any)=>void
 * }} props
 */
export default function DynamicForm({ fields, onSubmit }) {
  const [data, setData] = useState({});

  /**
   * @param {Field} field 
   * @param {import("react").ChangeEvent} e 
   */
  function handleChange(field, e) {
    let value;

    if (field.type === "checkbox") {
      value = e.target.checked;
    } else if (field.type === "file") {
      value = e.target.files;
    } else {
      value = e.target.value;
    }

    
    setData(prev => {
      const next = {...prev};
      if(!value){
        delete next[field.name];
        return next;
      }

      return{
        ...next,
        [field.name] : value
      }
    });
  
  }
  
  useEffect(()=>{
    for(const field of fields){
      field.default && setData(prev=>({...prev, [field.name]: field.default}));
    }
  },[fields])

  /**
   * @param {import("react").FormEvent<HTMLFormElement>} e 
   */
  function handleSubmit(e) {
    e.preventDefault();

    const finalData = {};

    for (const key in data) {
      const raw = data[key];

      finalData[key] = fields[key]?.parse
        ? fields[key].parse(raw)
        : raw;
    }

    onSubmit?.(finalData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields?.map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          {field?.type !== "hidden" && 
            <label className="font-medium" htmlFor={field.name}>{`${field.label} (${(field.required?? true)? "required": "optional"})`}</label>
          }

          {/* SELECT */}
          {field.as === "select" && !(field.source) &&(
            <select
              className="border rounded-md border-dotted p-2 outline-none "
              onChange={e => handleChange(field, e)}
              id={field.name}
              defaultValue=""
              required={field.required ?? true}
            >
              <option value="">
              </option>
              {field?.options?.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-background">
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* SELECT MODAL */}
          {field.as === "select" && field.source &&(
            <CreateModalSelector
              callback={handleChange}
              field={field}
              key={field.name}
            />
          )}

          {/*TEXTAREA*/}
          {field.as === "textarea" && (
            <textarea  
              className="border-b border-dotted dark:border-b-white border-b-black outline-none p-2 focus:border-red-400 dark:focus:border-blue-400"
              id={field.name}
              value={data[field.name] ?? field.default ?? ""}
              onChange={e => handleChange(field, e)}
            >
            </textarea>
          )}

          {/* INPUT */}
          {(!field.as || field.as === "input") && (
            <input
              className="border-b border-dotted dark:border-b-white border-b-black outline-none p-2 focus:border-red-400 dark:focus:border-blue-400"
              type={field.type ?? "text"}
              id={field.name}
              value={data[field.name] ?? field.default ?? ""}
              onChange={e => handleChange(field, e)}
              required={field.required ?? true}
            />
          )}

          {/* MASS INPUT */}
          {field.as === "massInput" &&(
            <CreateModalSelector
              callback={handleChange}
              field={field}
              key={field.name}
            />
          )}

        </div>
      ))}

      <button
        type="submit"
        className="dark:bg-blue-600 bg-red-600 text-white rounded p-2"
      >
        OK
      </button>
    </form>
  );
}

/**
 * @param {{field:Field, callback:Function | null | undefined}} param0 
 * 
 */
function CreateModalSelector({field,callback}) {

  const source = field["source"];

  const [data,setData] = useState(
    /**
     * @type {({label:string, value:string|number} | {})[]} 
     */
    ([{
      label:"",
      value:""
    }])
  );

  const [final,setFinal] = useState({
    label: "",
    value: ""
  })

  const [mode,setMode] = useState(
    /**
     * @type {"select" | "modal"}
     */
    ("select")
  );
  const [pagination,setPagination] = useState({
    page:1,
    limit:10,
    total:10,
  })

  const pageFlipper = useCallback((sign)=>
    {
      sign = Math.min(1,Math.max(-1,Number(sign)));
      const maxPage = Math.ceil(pagination.total / pagination.limit);
      if(pagination.page + sign > maxPage)return;

      setPagination((prev)=>({
        ...prev,
        page: Math.max(1, prev.page + sign)
      }));

    }, [pagination])

  useEffect(()=>{
    if(mode === "select") return;

    const controller = new AbortController();

    async function helper() {
      try{
        const url = new URL(source.url,window.location.origin);
        url.searchParams.set("page", pagination.page);
        url.searchParams.set("limit",pagination.limit);
        const {options,total} = await getOption({...source,url}, controller.signal);
        if(total > 0){
          setData(options);
          setPagination(prev=>({...prev,total:total}))
        }
      }catch(e){
        if(e.name === "AbortError") return;

        if(process.env.NODE_ENV === "development")
          console.error(e);

      }
    }

    helper();

    return ()=>controller?.abort()
  },[pagination.page, pagination.limit, mode])


  /**
   * @param {Event} e 
   */
  function clickTransform(data,e){
    e?.stopPropagation();
    if(mode === "modal"){
      setFinal(data);
      callback?.(field,{target:{value:data?.value}});

    }
    setMode(prev=>(prev === "select" ? "modal" : "select"));    
  }

  
  if(mode === "modal")
    return(
      <div className="inset-0 flex flex-col justify-center items-center gap-4 p-3 dark:bg-blue-500/30 bg-red-500/30 rounded-sm">
        <h2 className="text-white font-bold text-2xl">
          Select
        </h2>

        <div 
          className="flex flex-row justify-end items-end gap-1 size-fit"
        >
          <ThemeButton 
            height={"auto"} 
            width={"auto"} 
            fun={()=>pageFlipper(-1)} 
            text={<ArrowLeftCircleIcon/>}
          />

          <ThemeButton 
            height={"auto"} 
            width={"auto"} 
            fun={()=>pageFlipper(1)} 
            text={<ArrowRightCircleIcon />}
          />

        </div>


        <div 
          className="
            grid 
            auto-rows-fr
            sm:grid-cols-2 
            place-items-stretch  
            gap-x-1 gap-y-1.5 
            text-balance 
            *:flex
            *:items-center
            *:justify-center
            *:font-bold
            *:p-3
            ">

          <div key={"deff"} value="" onClick={(e)=>clickTransform(null,e)} className="bg-red-800/20 hover:bg-red-800/90 size-full rounded-md text-center border-black/70 border">
            {"Batal"}
          </div>

          {data?.map((x)=>{
            return <div key={x.value} onClick={(e)=>clickTransform(x,e)} className="hover:bg-black/15 size-full rounded-md text-center border-black/70 border ">{x.label}</div>;
          })}

        </div>      
      </div>
    );

  return(
    <select 
      name={field.name} 
      onClick={(e)=>clickTransform(null, e)}
      className="border rounded-md border-dotted p-2 outline-none"
      required={field?.required ?? true}
    >
      <option value={final?.value??""}>{final?.label??""}</option>
    </select>
  )

}

function Massmodal({field,callback}){
  const [refresh,setRefresh] = useState(true);
  const [visibleTool, setVisibleTool] = useState(true);

  const memo = useRef(new Set());
  const data = useRef([]);
  /**@type {import("react").InputHTMLAttributes} */
  const input = useRef(null)

  function del(i){
    delete data.current[i];
    memo.current.add(i);
    setRefresh(prev=>!prev);
  }

  function addnew(){
    if(!input.current)
      return;
    
    const val = input.current.value;

    if(memo.current.size > 0){
      const available = memo.current.values().next().value;
      data.current[available] = val;
      memo.current.delete(available);
      
    }else{
      data.current.push(val);
    }
    setRefresh(prev=>!prev);

  }

  function ok(){
    const filtered = data.current.flat();
    console.table(field);
    callback?.(field,{target:{value:filtered}});
    setVisibleTool(false);
  }

  return (
    <div 
      className="flex flex-col p-2 gap-2 justify-center items-center"
      onClick={e=>{
        e.stopPropagation();
        setVisibleTool(true);
      }}
    >
      {
        data.current?.map((item,idx)=>
          {
            if(item == null) return;

            return (
              <div className="flex flex-row gap-1" key={idx}>
                <input type="text" value={item} disabled={true} className="flex-4"/>
                <Trash2Icon onClick={()=>del(idx)}/>
              </div>
            )
          }
        )
      }
      {visibleTool &&
        <>
          <div>

            <input 
              type="text" 
              placeholder="input disini" 
              ref={input}
            />

            <button 
              type="button" 
              className="p-2 rounded-md bg-green-900/40" 
              onClick={
                ()=>addnew()
              }
            >
                Add
            </button>
          </div>

          <div id="buttongroup" className="flex flex-row justify-between items-stretch">

            <button 
              type="button" 
              className="p-2 rounded-md bg-green-900/40" 
              onClick={
                (e)=>{
                  e.stopPropagation();
                  ok()
                }
              }
            >
              Ok
            </button>

          </div>
        </>
      }
    </div>
  )
}