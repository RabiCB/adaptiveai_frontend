"use client";

import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  text: string;
  setText: (text: string) => void;
  wordCount: number;
  charCount: number;
}

export function TextInput({ text, setText, wordCount, charCount }: TextInputProps) {
  const handleClear = () => setText("");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="input-text"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
          Input Text
        </Label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {wordCount} words · {charCount} chars
          </span>
          {text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-muted-foreground hover:text-destructive"
              aria-label="Clear input text"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
      <div className="relative group">
        <Textarea
          id="input-text"
          placeholder="Paste or type your text here... We'll help make it easier to read and understand."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none text-base leading-relaxed focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          aria-describedby="input-help"
        />
        {!text && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-8 h-8" aria-hidden="true" />
              <span className="text-sm">Drop text or paste content</span>
            </div>
          </div>
        )}
      </div>
      <p id="input-help" className="sr-only">
        Enter or paste text that you want to summarize, simplify, or proofread
      </p>
    </div>
  );
}
