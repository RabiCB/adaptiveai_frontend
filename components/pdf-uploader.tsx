"use client";

import { useState } from "react";
import { FileText, Upload, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFUploaderProps {
  setText: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
  complexity: string;
  focus: string;
  format: string;
  maxLength: number;
  setResult: (result: string) => void;
}

export function PDFUploader({ 
  setText, 
  setIsLoading, 
  complexity,
  focus, 
  format,
  maxLength,
  setResult
}: PDFUploaderProps) {
  const [fileName, setFileName] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setIsUploaded(false);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Build query parameters with current settings
      const params = new URLSearchParams({
        complexity: complexity,
        focus: focus,
        format: format,
        max_length: maxLength.toString()
      });

      // Step 1 — uploading
      setUploadProgress("Uploading PDF...");

      // Step 2 — about to hit the server (extraction + summarization both happen server-side)
      setUploadProgress("Extracting text from PDF...");

      const response = await fetch(
        `http://localhost:8000/summarize-pdf?${params.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Step 3 — waiting on model (shown during the long await above)
      setUploadProgress("Summarising — this may take a moment...");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to process PDF");
      }

      const data = await response.json();

      // Set the summary in the result area
      setResult(data.summary);

      // Store the original extracted text (not the summary) for potential re-processing
      if (data.extracted_text) {
        setText(data.extracted_text);
      }

      setIsUploaded(true);
      setUploadProgress("");

    } catch (error) {
      console.error("Error processing PDF:", error);

      const errorMessage = error instanceof Error
        ? error.message
        : "Failed to process PDF";

      alert(`Error: ${errorMessage}\n\nPlease ensure the PDF contains selectable text.`);
      setFileName("");
      setIsUploaded(false);
      setUploadProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFileName("");
    setIsUploaded(false);
    setText("");
    setResult("");
    setUploadProgress("");
    // Reset the file input
    const input = document.getElementById("pdf-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Button */}
      {!fileName ? (
        <label
          htmlFor="pdf-upload"
          className="flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-primary to-primary/90 text-primary-foreground rounded-xl cursor-pointer hover:from-primary/90 hover:to-primary/80 transition-all duration-200 shadow-md hover:shadow-lg border border-primary/20"
        >
          <Upload className="w-5 h-5" />
          <span className="font-medium">Upload PDF Document</span>
        </label>
      ) : (
        /* File Info Card */
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0">
              {isUploaded ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : uploadProgress ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {isUploaded ? "Summarised successfully" : uploadProgress || "Processing..."}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="shrink-0 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Helper Text */}
      {!fileName && (
        <p className="text-xs text-center text-muted-foreground">
          Supports PDF files • Will be automatically summarised using current settings
        </p>
      )}
    </div>
  );
}