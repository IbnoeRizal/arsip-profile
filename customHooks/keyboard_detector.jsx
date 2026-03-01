"use client"
import { useEffect, useState } from "react";
const itemname = 'haskeyboard';


function useKeyboardPresece(){
    
    const [hasKeyboard, setHasKeyboard] = useState(false);
    
    useEffect(()=>{
        const memo = !!localStorage.getItem(itemname);
        setHasKeyboard(memo);
        if(hasKeyboard) return;

        const ref = () => setHasKeyboard(prev=>{
            localStorage.setItem(itemname, true);
            setHasKeyboard(true)
        })
        window.addEventListener("keydown",ref,{ once: true });
        
        return ()=>window.removeEventListener("keydown",ref)
    },[])

    return hasKeyboard;
}

export {
    useKeyboardPresece,
}