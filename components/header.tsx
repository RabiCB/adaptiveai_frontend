"use client";

import { BookOpen, Volume2, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSpeak: () => void;
  isSpeaking: boolean;
}

export function Header({ onSpeak, isSpeaking }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
            <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Adaptive Read
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-Powered Accessibility
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-2" aria-label="Quick actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSpeak}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            aria-label={isSpeaking ? "Stop reading aloud" : "Read page aloud"}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? "text-primary animate-pulse" : ""}`} aria-hidden="true" />
            <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Read Aloud"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            aria-label="Accessibility features"
          >
            <Accessibility className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Accessibility</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

