"use client"

import Loginform from "@/components/AuthenticationComp/Login"
import { Shield, Sparkles, Zap } from "lucide-react"

export default function LoginPage() {
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
              Build something amazing today
            </h1>
            <p className="text-lg text-background/70 max-w-md leading-relaxed">
              Join thousands of teams who trust our platform to power their most important work.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">Lightning Fast</p>
                  <p className="text-sm text-background/60">Built for speed and performance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">Enterprise Security</p>
                  <p className="text-sm text-background/60">Bank-grade encryption and compliance</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-background/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-background" />
                </div>
                <div>
                  <p className="font-medium text-background">AI Powered</p>
                  <p className="text-sm text-background/60">Smart features that help you work better</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-background/90 text-lg italic">
              &ldquo;This platform transformed how our team collaborates. We&apos;ve seen a 40% increase in productivity.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-background/20 flex items-center justify-center text-background font-medium">
                JD
              </div>
              <div>
                <p className="font-medium text-background">Jane Doe</p>
                <p className="text-sm text-background/60">CEO at TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <Shield className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-semibold text-foreground">Acme Inc</span>
          </div>

          <Loginform />

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <a href="/auth/register" className="font-medium text-foreground hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
