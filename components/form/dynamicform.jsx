"use client";

import { useState } from "react";

/**
 * @typedef {{
 *  label: string
 *  name: string
 *  type?: import("react").HTMLInputTypeAttribute
 *  as?: "input" | "select"
 *  options?: { label: string, value: string | number }[]
 *  parse?: (value:any)=>any
 * }} Field
 */

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

    setData(prev => ({
      ...prev,
      [field.name]: value
    }));
  }

  /**
   * @param {import("react").FormEvent<HTMLFormElement>} e 
   */
  function handleSubmit(e) {
    e.preventDefault();

    const finalData = {};

    for (const field of fields) {
      const raw = data[field.name];

      finalData[field.name] = field.parse
        ? field.parse(raw)
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
              className="border rounded p-2"
              onChange={e => handleChange(field, e)}
              id={field.name}
              defaultValue=""
            >
              <option value="" disabled>
                -- pilih --
              </option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* INPUT */}
          {(!field.as || field.as === "input") && (
            <input
              className="border-b border-dotted dark:border-b-white border-b-black outline-none p-2 focus:border-red-400 dark:focus:border-blue-400"
              type={field.type ?? "text"}
              id={field.name}
              onChange={e => handleChange(field, e)}
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
