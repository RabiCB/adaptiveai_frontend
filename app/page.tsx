import HomePage from "@/components/home/Homepage"
import { getCurrentUser, logout } from "./auth/auth.action"

export default async function Home() {
const user=await getCurrentUser()
console.log(user)


  return <>

  <HomePage  user={user}/>
  </>
}
