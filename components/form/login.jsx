"use client";

import { useEffect, useRef, useState } from "react";
import Status from "../status";
import { useRouter} from "next/navigation";
import DynamicForm from "./dynamicform";

/**
 * @param {string} email
 * @param {string} password
 * @param {AbortSignal} signal
 * @returns {Promise<Response>}
 */
const sendCredential = async (email, password, signal) => {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    signal,
  });
};

export default function Login() {
  const router = useRouter();

  const [respond, setRespond] = useState({
    /** @type {string | object} */
    message: "",
    code: 0,
  });

  const controllerRef = useRef(null);
  const timerRef = useRef(null);


  // HANDLE SUBMIT (INTI)
  const handleSubmit = async (data) => {
    
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const result = await sendCredential(
        data.email,
        data.password,
        controllerRef?.current?.signal
      );

      const body = await result.json();
      setRespond({ message: body.data, code: result.status });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    }
  };

  
  // REDIRECT SETELAH LOGIN
  useEffect(() => {
    if (respond.code === 200) {
      timerRef.current = setTimeout(() => {
        router.refresh();
      }, 1000);
    }

    return () => {
      controllerRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [respond.code]);

  return (
    <div className="w-fit flex justify-center items-center border-dotted border p-4 rounded-md">
      <Status {...respond} manual={true}/>
      <DynamicForm onSubmit={handleSubmit} fields={[
        {
          label:"Email",
          name:"email",
          as:"input",
          type:"email",
          parse:(x)=>String(x)
        },
        {
          label: "Password",
          name:"password",
          as: "input",
          type:"password",
          parse:(x)=>String(x),
        }
      ]}/>
    </div>
  );
}
