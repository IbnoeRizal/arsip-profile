"use client";

import { useEffect, useState } from "react";
import { UserCircle2Icon, X } from "lucide-react";
import Image from "next/image";

const STATUS = {
  OK: "OK",
  ERROR: "ERROR",
};

export default function ProfilePic({
  id,
  w = 300,
  h = 300,
  fun,
}) {
  const [status, setStatus] = useState(STATUS.OK);
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!id) return;

    const url = `/api/school/driveObj/${id}/profilepic`;

    setSrc(url);
    setStatus(STATUS.OK);
    const controller = new AbortController();

    async function getfileMeta() {
      try{
        const response = await fetch(url+"/meta",{signal:controller.signal});
        if(response.ok){
          const data = await response.json();
          fun?.(data.data);
        }
      }catch(e){
        if(e.name !== "AbortError" && process.env.NODE_ENV !== "production")
          console.error(e);

      }
    }

    if(typeof fun === "function")
      getfileMeta();

    return ()=>controller.abort();
  }, [id, fun]);

  return (
    <div
      className="rounded-full overflow-hidden shrink-0 ring-1 dark:ring-blue-300 ring-black/10"
      style={{ width: w, height: h }}
    >
      {status === STATUS.OK && src && (
        <Image
          src={src}
          alt="profile"
          width={w}
          height={h}
          className="w-full h-full object-cover"
          onError={() => setStatus(STATUS.ERROR)}
          unoptimized
          priority={false}
        />
      )}

      {(status === STATUS.ERROR || !src) && (
        <UserCircle2Icon className="w-full h-full text-gray-400" />
      )}
    </div>
  );
}