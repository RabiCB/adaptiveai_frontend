"use client";

import { Settings2, Sparkles, Target, LayoutList, Hash } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface OptionsPanelProps {
  mode: string;
  setMode: (mode: string) => void;
  complexity: string;
  setComplexity: (complexity: string) => void;
  focus: string;
  setFocus: (focus: string) => void;
  format: string;
  setFormat: (format: string) => void;
  maxLength: number;
  setMaxLength: (length: number) => void;
}

export function OptionsPanel({
  mode,
  setMode,
  complexity,
  setComplexity,
  focus,
  setFocus,
  format,
  setFormat,
  maxLength,
  setMaxLength,
}: OptionsPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Settings2 className="w-4 h-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-medium text-foreground">Processing Options</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Mode Selection */}
        <div className="space-y-2">
          <Label htmlFor="mode" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Mode
          </Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="mode" className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="summarize">Summarize</SelectItem>
              <SelectItem value="proofread">Proofread</SelectItem>
              <SelectItem value="simplify">Simplify</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Complexity */}
        <div className="space-y-2">
          <Label htmlFor="complexity" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="w-3 h-3" aria-hidden="true" />
            Reading Level
          </Label>
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger id="complexity" className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="original">Keep Original</SelectItem>
              <SelectItem value="very_simple">Very Simple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Focus */}
        <div className="space-y-2">
          <Label htmlFor="focus" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Target className="w-3 h-3" aria-hidden="true" />
            Focus On
          </Label>
          <Select value={focus} onValueChange={setFocus}>
            <SelectTrigger id="focus" className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select focus" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="key_points">Key Points</SelectItem>
              <SelectItem value="definitions">Definitions</SelectItem>
              <SelectItem value="action_items">Action Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label htmlFor="format" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <LayoutList className="w-3 h-3" aria-hidden="true" />
            Output Format
          </Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format" className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="bullet_points">Bullet Points</SelectItem>
              <SelectItem value="step_by_step">Step-by-Step</SelectItem>
              <SelectItem value="numbered">Numbered List</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Length */}
        <div className="space-y-2">
          <Label htmlFor="max-length" className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Hash className="w-3 h-3" aria-hidden="true" />
            Max Words: {maxLength}
          </Label>
          <Slider
            id="max-length"
            value={[maxLength]}
            onValueChange={(value) => setMaxLength(value[0])}
            min={50}
            max={500}
            step={25}
            className="py-2"
            aria-label={`Maximum length: ${maxLength} words`}
          />
        </div>
      </div>
    </div>
  );
}
