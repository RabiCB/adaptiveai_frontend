"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { signup } from '@/app/auth/auth.action'
import { useAppContext } from '@/ContextProvider/AppContextProvider'
import toast from 'react-hot-toast'
import SignupWithGoogle from './SignupWithGoogle'

export const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters."

    }).max(50, {
        message: "Username must be  less than 50 characters.",

    }),
    email: z.string().min(1, {
        message: "Email is required "
    }),
    password: z.string()?.min(6, {
        message: "Password must be at least 6 characters.",
    })?.max(16, {
        message: "Password must be  less than 16 characters.",

    }),
    confrimpassword: z.string().min(6, {
        message: "Please confirm your password.",

    }),


}).refine(data => data.password === data.confrimpassword, {
    message: "Passwords do not match.",
    path: ['confrimpassword']
})
const Register = () => {
    
    const {  handleCloseAuthModal } = useAppContext()
    const [error,setError]=useState<string>("")
    const [registring,setRegistring] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confrimpassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setRegistring(true)
        const res = await signup(values)



   
        if (res?.success) {
            setRegistring(false)
            console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
            location.reload()
            toast.success("user registered successfully")

        } else {
            setRegistring(false)


           setError(res.error as string)
           toast.error("something went wrong")


           setError(res.error as string)
    

        }
    }
    return (
        <Card  className='shadow-none max-md:border-none ' >
            <CardHeader>
                <CardTitle>Signup</CardTitle>

            </CardHeader>
            <CardContent className='shadow-none'>
                <Form {...form} >
                    <form style={{
                        scrollbarWidth: "none"
                    }} className='space-y-2.5 overflow-y-scroll ' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl className='w-full'>
                                        <Input placeholder="Drake" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="rollinrabin@gmail.com" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} type='password' />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confrimpassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="confrim password" {...field} type='password' />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {
                            error && <p className="text-red-500 ">{error}</p>
                        }
                       
                        <Button type="submit" className='w-full'>{!registring ?'Sign Up':'Signing up....'}</Button>
                       
                    </form>
                </Form>
                <SignupWithGoogle form='register'/>
            </CardContent>


        </Card>
    )
}

export default Register
