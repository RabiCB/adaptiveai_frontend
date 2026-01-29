import ProfilePage from '@/components/profile/Profilepage'
import React from 'react'
import { getCurrentUser } from '../auth/auth.action'

const page = async() => {

    const user=await getCurrentUser()

    
  return (
    <>
    <ProfilePage user={user}/>
    </>
  )
}

export default page