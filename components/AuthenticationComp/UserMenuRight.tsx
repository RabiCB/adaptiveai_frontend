import { logout } from '@/app/authenticate/auth.action'

import Link from 'next/link'
import React from 'react'
import { useUserStore } from '../../../store/userstore'

interface Menuprops{
    handleCloseUserMenu:()=>void
}

const usermenuoptions=[
  {
    label: 'Profile',
    href: '/profile?tab=gen',
  },
  {
    label:"Cart",
    href:"/cart"
  }

]
const UserMenuRight = ({handleCloseUserMenu}:Menuprops) => {
const {clearUser}=useUserStore()
  return (
    <div className='absolute top-12 right-4 w-[240px] max-h-[300px] p-4 rounded-[14px]   shadow-md  z-[999] border-[0.5px] bg-white'>
        <ul className='w-full h-full flex flex-col gap-2 '>

          {
            usermenuoptions.map((option, index) => (
              <Link prefetch key={index} href={option?.href ??' /'}>
                <div onClick={handleCloseUserMenu} className='hover:bg-gray-200 p-2 text-[#666666] rounded-md'>
                  {option.label}
                </div>
              </Link>
            ))
          }
<div onClick={()=>{
    logout().then((res)=>{
      if(res.success){
        window.location.reload()
      }
    })
    clearUser()
   
    handleCloseUserMenu()

    }} className='flex justify-between items-center hover:bg-gray-200 cursor-pointer p-2 rounded-md text-[#666666]'>
    <p>Logout</p>
</div>
        </ul>
    </div>
  )
}

export default UserMenuRight