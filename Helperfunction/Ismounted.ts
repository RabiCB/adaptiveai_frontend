import { useEffect, useState } from "react"

export const  Usemounted=()=>{
const [mounted,setIsMounted]=useState(false)

    useEffect(()=>{

        setIsMounted(true)
     
        return () => setIsMounted(false)
       
    },[ ]);

    return mounted

}