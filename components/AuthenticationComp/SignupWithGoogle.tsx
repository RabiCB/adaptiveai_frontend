"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { getGoogleAuthUrl } from '@/app/auth/auth.action'
import toast from 'react-hot-toast'
import { FaGoogle } from "react-icons/fa";
import { useAppContext } from '@/ContextProvider/AppContextProvider';
type pageprops={

    form:"login"|"register"

}
const SignupWithGoogle = ({form}:pageprops) => {
    const {handleAuthModal}=useAppContext()
    const [loading,setLoading]=useState(false)
  return (
    <>
         <Button onClick={async()=>{
          setLoading(true)
            const res= await getGoogleAuthUrl()
                  
      
            if(res.url){
                handleAuthModal()
                window.location.href=res.url
                setLoading(true)
               
            }else{
                toast.error('something went wrong')
                setLoading(false)
            }

         }}  className='w-full my-6 flex gap-4 items-center'>{form !=="login" ?'Signup':'Login'} With Google <FaGoogle size={18}/></Button>

          {loading && <div className="flex items-center justify-center w-full h-full fixed top-0 bottom-0 right-0 left-0 bg-gray-500 opacity-50 z-50">
            <div className="animate-spin w-16 h-16 text-white"></div>
          </div>}
    </>
  )
}

export default SignupWithGoogle