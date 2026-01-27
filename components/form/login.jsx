"use client";

import { useEffect, useRef, useState } from "react";
import Status from "../status";

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
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [respond, setRespond] = useState({
    /** @type {string | object} */
    message: "",
    code: 0,
  });

  const controllerRef = useRef(null);
  const timerRef = useRef(null);

  
  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  
  // HANDLE SUBMIT (INTI)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // batalkan request sebelumnya
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const result = await sendCredential(
        data.email,
        data.password,
        controller.signal
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
        window.location.reload();
      }, 1000);
    }

    return () => {
      controllerRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [respond.code]);

  return (
    <>
      <Status {...respond} manual={true} />

      <div className="container flex justify-center dark:brightness-150 brightness-95">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-80"
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Ok</button>
        </form>
      </div>
    </>
  );
}
