"use client"
import { useEffect, useState } from "react";
const itemname = 'haskeyboard';


function useKeyboardPresece(){
    
    const [hasKeyboard, setHasKeyboard] = useState(false);
    
    useEffect(()=>{
        if(localStorage.getItem(itemname)){
            setHasKeyboard(true);
            return;
        }

        const ref = () => {
            setTimeout(()=>localStorage.setItem(itemname, true),0);
            requestIdleCallback(()=>{
                setHasKeyboard(true);
            })
        }
        window.addEventListener("keydown",ref,{ once: true });
        
        return ()=>window.removeEventListener("keydown",ref);
    },[])

    return hasKeyboard;
}

export {
    useKeyboardPresece,
}