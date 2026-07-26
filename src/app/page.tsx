"use client";

import {
  FileSpreadsheet,
  ShieldCheck,
  History,
} from "lucide-react";

import { AllocationUpload } from "@/components/upload/allocation-upload";
import { WorkbookPreview } from "@/components/allocation/workbook-preview";
import { UploadProgressModal } from "@/components/shared/upload-progress-modal";

import { useWorkspace } from "@/hooks/use-workspace";

export default function HomePage() {

  const workspace = useWorkspace();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-16 sm:py-24">

      {/* Background */}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="page-boxed w-full space-y-12 px-4">

        {/* Hero */}

        <section className="page-header items-center text-center space-y-4">

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">

            Idotte

          </div>

          <h1 className="page-title">

            Placement

          </h1>

          <p className="page-description max-w-md mx-auto">

            Generate examination placement reports from allocation datasets and client lists in minutes.

          </p>

        </section>

        {/* Upload */}

        <section className="section-card">

          <div className="upload-zone relative">

            <div className="absolute right-4 top-4 flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px]">

              <ShieldCheck className="h-3 w-3 text-primary" />

              Secure Parsing

            </div>

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border bg-muted">

              <FileSpreadsheet className="h-10 w-10 text-primary" />

            </div>

            <h2 className="text-xl font-semibold">

              Upload Dataset

            </h2>

            <p className="mt-3 max-w-xs text-center text-sm text-muted-foreground">

              Drag & drop or choose your allocation workbook.

            </p>

            <div className="mt-8">

              <AllocationUpload
                onFileSelect={workspace.uploadAllocation}
              />

            </div>

          </div>

        </section>

        {/* Workbook Preview */}

        {workspace.allocationPreview && (

          <WorkbookPreview
            fileName={workspace.allocationPreview.fileName}
            sheetCount={workspace.allocationPreview.sheetCount}
            totalRecords={workspace.allocationPreview.totalRecords}
            uniqueCandidates={workspace.allocationPreview.uniqueCandidates}
            duplicateRecords={workspace.allocationPreview.duplicateRecords}
            namesWithDuplicates={workspace.allocationPreview.namesWithDuplicates}
            worksheets={workspace.allocationPreview.worksheets}
          />

        )}

        {/* Footer */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-4 text-xs text-muted-foreground sm:flex-row">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-ping rounded-full bg-primary" />

            System Operational

          </div>

          <span>

            Idotte v0.1.0

          </span>

          <button className="flex items-center gap-2">

            <History className="h-4 w-4" />

            Recent Runs

          </button>

        </div>

      </div>

      <UploadProgressModal
        open={workspace.isBusy}
        title={workspace.uploadMessage}
        progress={workspace.uploadProgress}
        complete={workspace.uploadStage === "complete"}
      />

    </main>
  );

}