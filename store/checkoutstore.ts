import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './userstore';

interface User {
  id: string;
  username: string;
  email: string;
  imageurl: string;
}

interface Address {
    fullname:string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  contact:string;
  postalcode: string;
  country: string;
}


type paymentstatus="Paid"|"Unpaid"|"Refund"| null
interface UserState {
 
  address: Address;
  total: number;
  paymentmethod:"Stripe"|"CashOnDelivery";
  setPaymentmethod: (paymenttype: "CashOnDelivery"|"Stripe") => void;
  setAddress: (address: Address) => void;
  setTotal: (total: number) => void;
  paymentstatus:paymentstatus;
  setPaymentStaus:(paymentstatus:paymentstatus)=>void
 
}



export const userCheckoutStore= create<UserState>()(
    
  persist(
    (set) => ({
     
      address: {
        fullname:" ",
        addressLine1: '',
        
        addressLine2: '',
        city: '',
        state: '',
        contact:'',
        postalcode: '',
        country: '',
      },
      total: 0,
    
      setAddress: (address) => set({ address }),
      setTotal: (total) => set({ total }),
      clearUser: () => set({  address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        fullname:'',
        state: '',
        postalcode: '',
        country: '',
        contact:'',
      }, total: 0 }),

      paymentmethod:"CashOnDelivery",
      setPaymentmethod:(paymentmethod:"CashOnDelivery"|"Stripe")=>set({
        paymentmethod
      }),
      paymentstatus:null,
      setPaymentStaus:(paymentstatus:paymentstatus)=>set({
        paymentstatus
      })

    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage), // Using sessionStorage for this example
    }
  )
);