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
    <div className='flex items-center  justify-center '>
         <a href='/api/auth/google'  className=' text-xs my-6 bg-green-200 px-3 py-3 rounded-sm  flex gap-4 items-center'>{form !=="login" ?'Signup':'Login'} With Google <FaGoogle size={18}/></a>

          
    </div>
  )
}

export default SignupWithGoogle