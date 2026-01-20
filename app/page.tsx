"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { TextInput } from "@/components/text-input";
import { OptionsPanel } from "@/components/options-panel";
import { OutputDisplay } from "@/components/output-display";
import {FeaturesSection } from "@/components/feature-selection";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { PDFUploader } from "@/components/pdf-uploader";

export default function Home() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("summarize");
  const [complexity, setComplexity] = useState("original");
  const [focus, setFocus] = useState("key_points");
  const [format, setFormat] = useState("paragraph");
  const [maxLength, setMaxLength] = useState(150);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSpeak = useCallback((textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleHeaderSpeak = useCallback(() => {
    const content = result || text || "No text available to read";
    handleSpeak(content);
  }, [result, text, handleSpeak]);

  const handleProcess = async () => {
    if (!text.trim()) {
      return;
    }

    setIsLoading(true);
    setResult("");

    // Simulated AI processing - replace with your actual API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let processedResult = "";

      if (mode === "summarize") {
        const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
        const keyPoints = sentences.slice(0, Math.min(3, sentences.length));
        
        if (format === "bullet_points") {
          processedResult = keyPoints.map((point) => `• ${point.trim()}`).join("\n\n");
        } else if (format === "numbered") {
          processedResult = keyPoints.map((point, i) => `${i + 1}. ${point.trim()}`).join("\n\n");
        } else if (format === "step_by_step") {
          processedResult = keyPoints.map((point, i) => `Step ${i + 1}: ${point.trim()}`).join("\n\n");
        } else {
          processedResult = keyPoints.join(". ").trim() + ".";
        }

        if (complexity === "very_simple") {
          processedResult = `Here's what this text is about:\n\n${processedResult}\n\nThis summary uses simple words that are easy to understand.`;
        }
      } else if (mode === "proofread") {
        processedResult = `Proofread version:\n\n${text.trim()}\n\n✓ Grammar checked\n✓ Spelling verified\n✓ Punctuation reviewed`;
      } else if (mode === "simplify") {
        processedResult = `Simplified version:\n\n${text.substring(0, 200).trim()}...\n\nThis text has been made easier to read with:\n• Shorter sentences\n• Simpler words\n• Clear structure`;
      }

      setResult(processedResult);
    } catch (error) {
      console.error("Processing error:", error);
      setResult("An error occurred while processing your text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-10" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Zap className="w-3 h-3" aria-hidden="true" />
            AI-Powered Accessibility
          </div>
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Make Text Accessible
            <br />
            <span className="text-primary">for Everyone</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
            Summarize, simplify, and proofread any text with AI. Designed for
            users with dyslexia, cognitive differences, or anyone who needs
            clearer content.
          </p>
        </section>

        {/* Main Tool Section */}
        <section className="space-y-6" aria-labelledby="tool-heading">
          <h2 id="tool-heading" className="sr-only">Text Processing Tool</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Column */}
            <div className="space-y-4">
                <PDFUploader setText={setText} setIsLoading={setIsLoading} />
              <TextInput
                text={text}
                setText={setText}
                wordCount={wordCount}
                charCount={charCount}
              />
              
              {/* Process Button - Mobile */}
              <div className="lg:hidden">
                <Button
                  onClick={handleProcess}
                  disabled={!text.trim() || isLoading}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      Process Text
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output Column */}
            <OutputDisplay
              result={result}
              mode={mode}
              isLoading={isLoading}
            />
          </div>

          {/* Options Panel */}
          <OptionsPanel
            mode={mode}
            setMode={setMode}
            complexity={complexity}
            setComplexity={setComplexity}
            focus={focus}
            setFocus={setFocus}
            format={format}
            setFormat={setFormat}
            maxLength={maxLength}
            setMaxLength={setMaxLength}
          />

          {/* Process Button - Desktop */}
          <div className="hidden lg:flex justify-center">
            <Button
              onClick={handleProcess}
              disabled={!text.trim() || isLoading}
              size="lg"
              className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  Process Text
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Adaptive Read · Designed with accessibility in mind · Built for everyone
          </p>
        </footer>
      </main>
    </div>
  );
}
