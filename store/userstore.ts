import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
 interface User {
  id: string
  username: string
  email: string
  imageUrl:string
  

}

interface UserState {
  user: User | null



  setUser: (user: User | null) => void


  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
   
      
    }),
    {
      name: 'user',
    
    }
  )
)