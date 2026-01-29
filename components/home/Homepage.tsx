"use client"

import { useState, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { TextInput } from "@/components/text-input"
import { OptionsPanel } from "@/components/options-panel"
import { OutputDisplay } from "@/components/output-display"
import { FeaturesSection } from "@/components/feature-selection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowRight, Zap, Link2, FileText, Upload, Save } from "lucide-react"
import { PDFUploader } from "@/components/pdf-uploader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Home({user}:{user:any}) {

  console.log(user,"from client")
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "url" | "pdf">("text");
  const [mode, setMode] = useState("summarize");
  const [complexity, setComplexity] = useState("original");
  const [focus, setFocus] = useState("key_points");
  const [format, setFormat] = useState("paragraph");
  const [maxLength, setMaxLength] = useState(150);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const [loadingpdf, setLoadingpdf] = useState(true);
  
  useEffect(() => {
    setLoadingpdf(false);
  }, [])

  // -------------------------
  // Text to Speech
  // -------------------------
  const handleSpeak = useCallback(
    (textToSpeak: string) => {
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
    },
    [isSpeaking]
  );

  const handleHeaderSpeak = useCallback(() => {
    const content = result || text || "No text available to read";
    handleSpeak(content);
  }, [result, text, handleSpeak]);

  // -------------------------
  // FASTAPI INTEGRATION
  // -------------------------
  const handleProcess = async () => {
    if (inputMode === "text" && !text.trim()) return;
    if (inputMode === "url" && !url.trim()) return;
    if (inputMode === "pdf" && !text.trim()) return;

    setIsLoading(true);
    setResult("");

    try {
      let response;
      
      if (inputMode === "url") {
        // Call URL endpoint
        response = await fetch("http://localhost:8000/summarize-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url.trim(),
            complexity,
            focus,
            format,
            max_length: maxLength,
          }),
        });
      } else {
        // Call text endpoint (works for both text and PDF-extracted text)
        response = await fetch("http://localhost:8000/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            complexity,
            focus,
            format,
            max_length: maxLength,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to process content");
      }

      const data = await response.json();
      setResult(data.summary);
    } catch (error) {
      console.error("Processing error:", error);
      setResult(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : "An error occurred while processing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // SAVE SUMMARY
  // -------------------------
  const handleOpenSaveDialog = () => {
    if (!result.trim()) {
      alert("No summary to save. Please generate a summary first.");
      return;
    }
    
    // Auto-generate a title from the first few words of the content
    const autoTitle = text.trim().split(/\s+/).slice(0, 5).join(" ") + "...";
    setSaveTitle(autoTitle);
    setShowSaveDialog(true);
  };

  const handleSaveSummary = async () => {
    if (!saveTitle.trim()) {
      alert("Please enter a title for your summary.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/user/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: saveTitle.trim(),
          content: result,
          
         
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save summary");
      }

      const data = await response.json();
      
      // Success feedback
      alert("Summary saved successfully!");
      setShowSaveDialog(false);
      setSaveTitle("");
      
    } catch (error) {
      console.error("Save error:", error);
      alert(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : "Failed to save summary. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isProcessDisabled = () => {
    if (isLoading) return true;
    if (inputMode === "text") return !text.trim();
    if (inputMode === "url") return !url.trim();
    if (inputMode === "pdf") return !text.trim();
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSpeak={handleHeaderSpeak} isSpeaking={isSpeaking} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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

        {/* Main Tool */}
        <section className="space-y-6" aria-labelledby="tool-heading">
          <h2 id="tool-heading" className="sr-only">
            Text Processing Tool
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="space-y-4">
              {/* Input Mode Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setInputMode("text")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    inputMode === "text"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Text
                </button>
                <button
                  onClick={() => setInputMode("url")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    inputMode === "url"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  URL
                </button>
                <button
                  onClick={() => setInputMode("pdf")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    inputMode === "pdf"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  PDF
                </button>
              </div>

              {/* Conditional Input */}
              {inputMode === "text" ? (
                <TextInput
                  text={text}
                  setText={setText}
                  wordCount={wordCount}
                  charCount={charCount}
                />
              ) : inputMode === "url" ? (
                <div className="space-y-2">
                  <label htmlFor="url-input" className="text-sm font-medium text-foreground">
                    Enter URL
                  </label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a URL to automatically extract and summarize its content
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <PDFUploader 
                    setText={setText} 
                    setIsLoading={setIsLoading}
                    complexity={complexity}
                    focus={focus}
                    format={format}
                    maxLength={maxLength}
                    setResult={setResult}
                  />
                  {text && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Summary Preview:</p>
                      <p className="text-sm line-clamp-3">{text}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Button */}
              <div className="lg:hidden">
                <Button
                  onClick={handleProcess}
                  disabled={isProcessDisabled()}
                  className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Process {inputMode === "url" ? "URL" : inputMode === "pdf" ? "PDF" : "Text"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output */}
            <OutputDisplay result={result} mode={mode} isLoading={isLoading} />
          </div>

          {/* Save Button (shown when there's a result) */}
          {result && (
            <div className="flex justify-center">
              <Button
                onClick={handleOpenSaveDialog}
                variant="outline"
                size="lg"
                className="gap-2 border-2 hover:bg-primary/10"
              >
                <Save className="w-5 h-5" />
                Save Summary
              </Button>
            </div>
          )}

          {/* Options */}
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

          {/* Desktop Button */}
          <div className="hidden lg:flex justify-center">
            <Button
              onClick={handleProcess}
              disabled={isProcessDisabled()}
              size="lg"
              className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-medium"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Process {inputMode === "url" ? "URL" : inputMode === "pdf" ? "PDF" : "Text"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Adaptive Read · Designed with accessibility in mind · Built for
            everyone
          </p>
        </footer>
      </main>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Summary</DialogTitle>
            <DialogDescription>
              Give your summary a title to save it for later reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="save-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="save-title"
                placeholder="Enter a title for your summary..."
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Summary Preview
              </label>
              <div className="p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm">{result.substring(0, 200)}...</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSummary}
              disabled={isSaving || !saveTitle.trim()}
              className="gap-2"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}