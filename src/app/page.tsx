"use client";

import { useState } from "react";
import { AllocationUpload } from "@/components/upload/allocation-upload";
import { FileSpreadsheet, ArrowUpFromLine, ShieldCheck, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseAllocationWorkbook } from "@/engine/allocation/parser";
import type { WorkbookPreview as WorkbookPreviewType } from "@/types/preview";
import { WorkbookPreview } from "@/components/allocation/workbook-preview";

export default function HomePage() {

  const [allocationFile, setAllocationFile] =
  useState<File | null>(null);

  const [preview, setPreview] =
  useState<WorkbookPreviewType | null>(null);

  // Read the workbook
  async function handleAllocationUpload(file: File) {
    setAllocationFile(file);

    const summary = await parseAllocationWorkbook(file);

    setPreview({
      fileName: file.name,

      sheetCount: summary.sheetCount,

      totalRecords: summary.worksheets.reduce(
        (total, sheet) => total + sheet.rowCount,
        0
      ),

      worksheets: summary.worksheets.map((sheet) => ({
        name: sheet.name,
        rowCount: sheet.rowCount,
      })),
    });

    console.table(summary.worksheets[0].records.slice(0, 5));
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-16 sm:py-24">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="page-boxed w-full space-y-12 px-4">

        {/* Hero Section */}
        <section className="page-header items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary backdrop-blur-md">
            Idotte
          </div>

          <h1 className="page-title font-heading text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text">
            Placement
          </h1>

          <p className="page-description max-w-xl text-base text-muted-foreground sm:text-lg mx-auto">
            Generate complex examination placement reports from allocation datasets and candidate lists in minutes instead of tedious hours.
          </p>
        </section>

        {/* Upload Container Layer */}
        <section className="section-card relative overflow-hidden">
          <div className="upload-zone group relative px-6 cursor-pointer">
            
            {/* Visual Indicator Top Right */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium bg-muted text-muted-foreground border border-border/40">
              <ShieldCheck className="h-3 w-3 text-primary" /> Secure Parsing
            </div>

            {/* Icon Box */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-background to-muted border border-border/80 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <FileSpreadsheet className="h-10 w-10 text-primary" />
            </div>

            {/* Typography */}
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Upload Dataset
            </h2>

            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground/90 leading-relaxed">
              Drag and drop your Excel workbook here or click below to browse local storage.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs justify-center">
              <AllocationUpload
                onFileSelect={handleAllocationUpload}
              />
              {
                allocationFile && (
                  <p className="mt-4 text-sm text-primary">
                    Selected: {allocationFile.name}
                  </p>
                )
              }
            </div>

            <p className="mt-5 text-xs text-muted-foreground/70">
              Supports standard <span className="font-medium text-foreground">.xlsx</span> matrices up to 25MB
            </p>
          </div>
        </section>

        {preview && (
          <WorkbookPreview
            fileName={preview.fileName}
            sheetCount={preview.sheetCount}
            totalRecords={preview.totalRecords}
            worksheets={preview.worksheets}
          />
        )}

        {/* Platform Footer / Quick Meta Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            System Status: Operational
          </div>
          <span className="font-medium tracking-wider">Idotte v0.1.0</span>
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <History className="h-3.5 w-3.5" /> Recent Runs
          </button>
        </div>

      </div>
    </main>
  );
}
