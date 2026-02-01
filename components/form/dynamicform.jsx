"use client";

import { useEffect, useState } from "react";

/**
 * @typedef {{
 *  label: string
 *  name: string
 *  type?: import("react").HTMLInputTypeAttribute
 *  as?: "input" | "select" | "textarea"
 *  options?: { label: string, value: string | number }[]
 *  parse?: (value:any)=>any,
 *  required?: boolean,
 *  source?: {
 *    url:string,
 *    getlabel: string[],
 *    getvalue: string[],
 *  }
 * }} Field
 */

/**
 * @param {Field['source']} source 
 * @returns {Promise<Field['options']>}
 */
async function getOption(source){
  const options = [];
  try{
    const result = await fetch(source.url);
    const data = (await result.json()).data;
    
    if(result.ok){
      const ref = data?.length >=2 && !isNaN(data[1]) ? data[0] : data;

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
    console.error(err)
  }finally{
    return options;
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
  const [options, setOptions] = useState({});

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
      if(!value){
        delete prev[field.name];
        return prev;
      }

      return{
        ...prev,
        [field.name] : value
      }
    });
  
  }

  useEffect(()=>{
    for(let i = 0 ; i < fields.length; ++i){
      const has_select_and_source = fields[i].as === "select" && fields[i].source;
      const has_default_option = fields[i].options?.length > 0;

      if(has_default_option){
        setOptions(prev=>({
          ...prev,
          [fields[i].name] : fields[i].options
        }));
      }

      if(has_select_and_source){
        async function helper() {
          const options = await getOption(fields[i].source);

          setOptions(prev => ({
            ...prev,
            [fields[i].name] : options
          }))
        }

        helper();
      }
    }
  },[]);

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
      {fields.map(field => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="font-medium" htmlFor={field.name}>{field.label}</label>

          {/* SELECT */}
          {field.as === "select" && (
            <select
              className="border rounded-md border-dotted p-2 outline-none "
              onChange={e => handleChange(field, e)}
              id={field.name}
              defaultValue=""
              required={field.required ?? true}
            >
              <option value="" disabled>
                -- pilih --
              </option>
              {options[field.name]?.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-background active:bg-background  focus:bg-background">
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/*TEXTAREA*/}
          {field.as === "textarea" && (
            <textarea  
              className="border-b border-dotted dark:border-b-white border-b-black outline-none p-2 focus:border-red-400 dark:focus:border-blue-400"
              id={field.name}

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
              onChange={e => handleChange(field, e)}
              required={field.required ?? true}
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
