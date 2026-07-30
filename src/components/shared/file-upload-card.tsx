"use client";
import { ReactNode } from "react";
import {
  ShieldCheck,
  Upload,
} from "lucide-react";

interface FileUploadCardProps{
  title:string;
  description:string;
  buttonText:string;
  icon:ReactNode;
  error?:string|null;
  accept?:string;
  onFileSelect:(file:File)=>void|Promise<void>;
}

export function FileUploadCard({
  title,
  description,
  buttonText,
  icon,
  error,
  accept=".xlsx",
  onFileSelect,
}:FileUploadCardProps) {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    // Allows selecting the same file again.
    event.target.value = "";
  }
  return (
    <section className="section-card relative overflow-hidden">
      <div className="upload-zone group relative px-6">
        {/* Status */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-md border border-border/40 bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-primary" />
          Ready
        </div>
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/80 bg-gradient-to-b from-background to-muted shadow-inner">
          {icon}
        </div>
        {/* Heading */}
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {/* Description */}
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {/* Upload */}
        <div className="mt-8 flex justify-center">
          <label className="cursor-pointer">
            <input
              hidden
              type="file"
              accept={accept}
              onChange={handleChange}
            />
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Upload className="h-4 w-4" />
              {buttonText}
            </span>
          </label>
        </div>
        {/* Footer */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Supports{" "}
          <span className="font-medium text-foreground">
            {accept}
          </span>
        </p>
      </div>
    </section>
  );
}