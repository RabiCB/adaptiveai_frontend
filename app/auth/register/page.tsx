"use client"

import Register from "@/components/AuthenticationComp/Register"
import { Shield, Sparkles, Zap, Users } from "lucide-react"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center">
              <Shield className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xl font-semibold text-background">Acme Inc</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-background leading-tight text-balance">
              Start your journey with us
            </h1>
            <p className="text-lg text-background/70 max-w-md leading-relaxed">
              Create your account and join a community of innovators building the future.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">Get Started in Minutes</p>
                  <p className="text-sm text-background/60">Quick setup, no credit card required</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">Join 10,000+ Teams</p>
                  <p className="text-sm text-background/60">Trusted by leading companies worldwide</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">Free Forever Plan</p>
                  <p className="text-sm text-background/60">Generous limits for personal projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="space-y-4">
            <div className="flex -space-x-2">
              {["JD", "MK", "AS", "TC", "RB"].map((initials, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full bg-background/20 border-2 border-foreground flex items-center justify-center text-background text-sm font-medium"
                >
                  {initials}
                </div>
              ))}
              <div className="h-10 px-3 rounded-full bg-background/20 border-2 border-foreground flex items-center justify-center text-background text-sm font-medium ml-2">
                +2.5k
              </div>
            </div>
            <p className="text-background/70">
              Join thousands of developers and teams already using our platform
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <Shield className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-semibold text-foreground">Acme Inc</span>
          </div>

          <Register />

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {"Already have an account? "}
              <a href="/" className="font-medium text-foreground hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
