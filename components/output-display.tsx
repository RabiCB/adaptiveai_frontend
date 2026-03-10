"use client";

import { CheckCircle2, Copy, Download, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AudioPlayer } from "./audio-player";

interface OutputDisplayProps {
  result: string;
  mode: string;
  isLoading: boolean;
}

export function OutputDisplay({ result, mode, isLoading }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const closeAudioPlayer=()=>{
    setShowPlayer(false)
  }

  const getModeLabel = () => {
    switch (mode) {
      case "summarize":
        return "Summary";
      case "proofread":
        return "Proofread Result";
      case "simplify":
        return "Simplified Text";
      default:
        return "Result";
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center min-h-[200px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" aria-hidden="true" />
        <p className="text-muted-foreground text-sm" aria-live="polite">
          Processing your text...
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Making it more accessible
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Your processed text will appear here
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1 text-center">
          Enter text and click process to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/30 bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">{getModeLabel()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={showPlayer ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowPlayer(!showPlayer)}
              className={`h-8 px-3 gap-1.5 ${showPlayer ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
              aria-label={showPlayer ? "Hide audio player" : "Listen to text"}
              aria-expanded={showPlayer}
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-medium">Listen</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
              aria-label={copied ? "Copied to clipboard" : "Copy result"}
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-primary"
              aria-label="Download result"
              onClick={() => {
                const blob = new Blob([result], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `adaptive-read-${mode}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="p-5">
          <div
            className="prose prose-invert prose-sm max-w-none text-foreground leading-relaxed"
            style={{ whiteSpace: "pre-wrap" }}
            role="region"
            aria-label={getModeLabel()}
            tabIndex={0}
          >
            {result}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer text={result} onClose={closeAudioPlayer} isVisible={showPlayer} />
    </div>
  );
}
