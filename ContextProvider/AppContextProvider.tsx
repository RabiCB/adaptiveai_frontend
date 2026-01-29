"use client"

import { create } from "domain";
import { PropsWithChildren, useContext, useState } from "react";
import { createContext } from "react";

type ContextProps={
    OpenAuthModal:boolean
    OpencartModal:boolean
    handleAuthModal:()=>void
    handleCloseAuthModal:()=>void
    handleOpenCartModal:()=>void
    handleCloseCartModal:()=>void

    
}
const AppContext=createContext<ContextProps>({
OpenAuthModal:false,
handleAuthModal:()=>{},
OpencartModal:false,
handleCloseCartModal:()=>{},
handleOpenCartModal:()=>{},
handleCloseAuthModal:()=>{}

})


export const AppContextProvider=({children}:PropsWithChildren)=>{

    const [OpenAuthModal, setOpenAuthModal]=useState<boolean>(false)

    const [OpencartModal,setOpenCartModal]=useState<boolean>(false)

    const handleAuthModal=()=>{
        setOpenAuthModal(!OpenAuthModal)
    }

    const handleCloseAuthModal=()=>{
        setOpenAuthModal(false)
    }
    const handleOpenCartModal=()=>{
        setOpenCartModal(true)
    }

    const handleCloseCartModal=()=>{
        setOpenCartModal(false)
    }
  
    return(
        <AppContext.Provider value={{
            handleAuthModal,
            handleOpenCartModal,
            handleCloseCartModal,
            OpenAuthModal,
            OpencartModal,
            handleCloseAuthModal,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext=()=>{
    return useContext(AppContext)
}