"use client";

import { useEffect, useRef, useState } from "react";
import Status from "../status";
import { useRouter} from "next/navigation";
import DynamicForm from "./dynamicform/dynamicform";
import { useCredential } from "@/context/usercredential";

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
  
  const userCredential = useCredential();
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

  if(userCredential?.id)
    return null;

  return (
    <div className="w-fit flex flex-col  gap-2 justify-center items-center border-dotted border p-4 rounded-md bg-background">
      <Status {...respond} manual={true}/>
      <h2 className="font-bold text-2xl text-shadow-md dark:text-shadow-blue-500 text-shadow-red-500 p-2">Login</h2>
      <DynamicForm onSubmit={handleSubmit} fields={[
        {
          label:"Email",
          name:"email",
          as:"input",
          type:"email",
          parse:String
        },
        {
          label: "Password",
          name:"password",
          as: "input",
          type:"password",
          parse:String,
        }
      ]}/>
    </div>
  );
}