"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/ContextProvider/AppContextProvider'
import toast from 'react-hot-toast'
import SignupWithGoogle from './SignupWithGoogle'
import { Loader2, Mail, Lock } from 'lucide-react'
import { getGoogleAuthUrl, signIn } from '@/app/auth/auth.action' // Import SignIn function


export const loginSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required "
    }),
    password: z.string()?.min(6, {
        message: "Password must be at least 6 characters.",
    })?.max(16, {
        message: "Password must be  less than 16 characters.",
    })
})

const Loginform = () => {
    const { handleAuthModal, handleCloseAuthModal } = useAppContext()
    const [error, setError] = useState<string>("")
    const [isLoggingin, setIsLoggingin] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            setIsLoggingin(true)
            const res = await signIn(values)

            if (res?.success) {
                 router.push("/")
                setIsLoggingin(false)
            }
            if (!res?.success) {
                setIsLoggingin(false)
                setError(res?.error as string)
            }
        } catch (error) {
            setIsLoggingin(false)
        }
    }


     const handleGoogleSignIn = async () => {
    router.push(`/api/auth/google`);
  };
    return (
        <section className="w-full max-w-md border-0  shadow-none bg-transparent md:border md:shadow-lg md:bg-card md:rounded-2xl overflow-hidden">
  {/* Header */}
  <div className="space-y-1 pb-6 pt-4 px-4">
    <div className="flex items-center justify-center mb-4">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Lock className="h-6 w-6 text-primary" />
      </div>
    </div>

    <h2 className="text-2xl font-semibold text-center tracking-tight">
      Welcome back
    </h2>

    <p className="text-sm text-muted-foreground text-center">
      Enter your credentials to access your account
    </p>
  </div>

  {/* Content */}
  <div className="px-8 pb-8">
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    className="pl-10 h-11 bg-secondary/50 border-input/50 focus:bg-background transition-colors"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-secondary/50 border-input/50 focus:bg-background transition-colors"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoggingin}
          className="w-full h-11 text-sm font-medium transition-all inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoggingin ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </Form>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>

    {/* Google Auth */}
    <SignupWithGoogle form="login" />
  </div>
</section>

    )
}

export default Loginform
