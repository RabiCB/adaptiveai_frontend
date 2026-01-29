"use client";

import { BookOpen, Volume2, VolumeX, Accessibility, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "lucia";
import { logout } from "@/app/auth/auth.action";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  onSpeak: () => void;
  isSpeaking: boolean;
  user: User;
}

export function Header({ onSpeak, isSpeaking, user }: HeaderProps) {
  const handleStopSpeaking = () => {
    if (isSpeaking && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <header className="border-b border-border bg-gradient-to-r from-card/80 via-card/50 to-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-sm">
            <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              Adaptive Read
              <Sparkles className="w-4 h-4 text-primary/70" />
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              AI-Powered Accessibility
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <nav className="flex items-center gap-2" aria-label="Quick actions">
          {/* Read Aloud Button */}
          {isSpeaking ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStopSpeaking}
              className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              aria-label="Stop reading aloud"
            >
              <VolumeX className="w-4 h-4 animate-pulse" aria-hidden="true" />
              <span className="hidden sm:inline font-medium">Stop</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onSpeak}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/50"
              aria-label="Read page aloud"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline font-medium">Read Aloud</span>
            </Button>
          )}

          {/* Accessibility Button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            aria-label="Accessibility features"
          >
            <Accessibility className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Settings</span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                >
                  <Avatar  className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-background">
                    <AvatarFallback className="bg-transparent text-white font-bold text-base">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || "user@adaptive-read.com"}
                    </p>
                    <Link href="/profile" className="text-xs mt-3 font-bold text-primary hover:underline">Profile</Link>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  onClick={async () => {
                    await logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}