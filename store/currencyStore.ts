import { create, createStore } from "zustand";
import { persist } from "zustand/middleware";


interface currency {
    
  
  
  currency:string;

    setCurrency: (currency:string) => void
  
  
    
  }

export const useCurrencyStore=create<currency>()(
    persist(
        (set)=>({
            currency: "NPR",
            setCurrency: (currency: string) => set({ currency }),
        })
        ,{
            name: "currencyStore",
           
        }
    )
)