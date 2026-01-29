import { logout } from "@/app/auth/auth.action";

export const getFirstLetters = (name: string): string => {

    if(!name){
        logout()
    }
    const words=name?.charAt(0)
   return  words.toUpperCase()

  };