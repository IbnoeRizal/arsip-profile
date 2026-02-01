'use client'
import { createContext, useContext } from "react"
import { Role } from "@/generated/prisma/browser";

/**
 * @typedef {{
 *     id: string,
 *     role: Role
 * }} CredentialType
 */

const Credential = createContext(
    /**@type {CredentialType | null} */ (null)
);

export const useCredential = function (){
    const ctx = useContext(Credential);
    if(!ctx)
        throw new Error("useCredential must be used inside CredentialProvider");
    return ctx;
}

/**
 * 
 * @param {{
 *   children:import("react").ReactNode, 
 *   id:string | null, 
 *   role:Role|null
 * }} param0 
 * @returns {import("react").JSX.Element}
 */
export function CredentialProvider({children,id,role}){
    const ctx = useContext(Credential);
    if(ctx)
        return(<>{children}</>);

    return (
        <Credential value={{id:id, role:role}}>
            {children}
        </Credential>
    )
}