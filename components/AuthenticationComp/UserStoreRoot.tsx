"use client"

import React, { useEffect } from 'react'
import { useUserStore } from '../../../store/userstore'
import useUserCartStore from '../../../store/usercartstore'

import { useGetcart } from '@/Datafetchhelperfunctions/useGetCart'

const UserStoreRoot = ({ user }: { user: any }) => {
    const { setUser } = useUserStore()
    const { setCart } = useUserCartStore()
    const { data:cartData, isLoading, isSuccess,isError } = useGetcart()
    useEffect(() => {
        if(user){
            setUser(user || null)
        }
      
    }, [user, setUser])
    useEffect(() => {
        
        if (cartData) {
           
            setCart(cartData as any)
        }
    }, [cartData, setCart])
    return null
}

export default UserStoreRoot