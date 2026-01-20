"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import {  GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
interface PDFUploaderProps {
  setText: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export function PDFUploader({ setText, setIsLoading }: PDFUploaderProps) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      // ✅ Explicitly disable worker to avoid "No workerSrc" error
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        disableWorker: true
      });

      const pdf = await loadingTask.promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        extractedText += strings.join(" ") + "\n\n";
      }

      setText(extractedText.trim());
    } catch (error) {
      console.error("Error reading PDF:", error);
      alert("Failed to extract text from PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 bg-primary/5 text-primary text-sm hover:bg-primary/10">
        <FileText className="w-4 h-4" />
        {fileName || "Upload PDF"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
