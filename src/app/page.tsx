"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  History,
  Users,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { ErrorModal } from "@/components/shared/error-modal";
import { FileUploadCard } from "@/components/shared/file-upload-card";
import { WorkbookPreview } from "@/components/allocation/workbook-preview";
import { UploadProgressModal } from "@/components/shared/upload-progress-modal";
import { useWorkspace } from "@/hooks/use-workspace";
import { WorkspaceOverview } from "@/components/workspace/workspace-overview";
import { MatchingDashboard } from "@/components/matching/matching-dashboard";
import { DuplicateResolution } from "@/components/matching/duplicate-resolution";
import { DuplicateReview } from "@/components/matching/duplicate-review";
import { ReportViewer } from "@/components/report/report-viewer";
import Link from "next/link";

// 1. Ingest JSON matching engine boundaries
import { parseClientExcelFile } from "@/admission/engine/parse-client";
import { generateAndLogAdmissionReport } from "@/admission/engine/map-client";
import { admissionDatastream, schoolDirectory } from "@/admission/data";

type EngineMode = "PLACEMENT" | "ADMISSION";

export default function HomePage() {
  const workspace = useWorkspace();
  const [engineMode, setEngineMode] = useState<EngineMode>("PLACEMENT");
  const [admissionError, setAdmissionError] = useState<string | null>(null);

  // 2. Specialized processing coordinator for the Admission data stream
  async function handleAdmissionClientUpload(file: File) {
    setAdmissionError(null);
    try {
      const clientRows = await parseClientExcelFile(file);
      if (clientRows.length === 0) {
        throw new Error("No student records found. Check your file columns layout.");
      }
      
      // Execute the deterministic 3-tier mapping pipeline
      const masterReport = generateAndLogAdmissionReport(clientRows, admissionDatastream);
      
      alert("Admission Report generated successfully! Press F12 to check your developer console summaries.");
    } catch (err: any) {
      setAdmissionError(err.message || "An error occurred during admission mapping.");
    }
  }

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
            {engineMode === "PLACEMENT" ? "Placement Mapping" : "Admission Mapping"}
          </h1>
          <p className="page-description max-w-lg mx-auto">
            {engineMode === "PLACEMENT" 
              ? "Generate examination placement reports from allocation datasets and client lists in minutes. A Mrs Olujobi software tool."
              : "Map student lists across master JSON datastreams to instantly generate Admitted, Redirected, and Not Admitted tables."
            }
          </p>
        </section>

        {/* Engine Mode Toggle Selector */}
        <div className="mx-auto max-w-md space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 border border-border/40 shadow-sm">
            <button
              type="button"
              onClick={() => setEngineMode("PLACEMENT")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
                engineMode === "PLACEMENT"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Placement
            </button>
            
            <button
              type="button"
              onClick={() => setEngineMode("ADMISSION")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
                engineMode === "ADMISSION"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Admission
            </button>
          </div>
          
          <p className="text-center text-[11px] text-muted-foreground leading-normal px-2">
            {engineMode === "PLACEMENT"
              ? "Requires Stage 1 allocation workbook uploading step sequence beforehand to lock layout boundaries."
              : "Uses optimized static local database arrays. Upload your client list directly to get results."
            }
          </p>
        </div>

        {/* Dynamic Workflow Engine Routing */}
        {engineMode === "PLACEMENT" ? (
          <>
            {/* Stage 1 - Placement Mapping Allocation Upload */}
            {!workspace.allocationSummary && (
              <FileUploadCard
                title="Upload Dataset"
                description="Upload the allocation workbook that contains SchoolName and CentreName cols to begin."
                buttonText="Choose Workbook"
                icon={<FileSpreadsheet className="h-10 w-10 text-primary" />}
                error={workspace.allocationError}
                onFileSelect={workspace.uploadAllocation}
              />
            )}

            {/* Stage 2 - Placement Mapping Client Upload */}
            {workspace.allocationSummary && !workspace.clientSummary && (
              <>
                <WorkbookPreview
                  fileName={workspace.allocationPreview!.fileName}
                  sheetCount={workspace.allocationPreview!.sheetCount}
                  totalRecords={workspace.allocationPreview!.totalRecords}
                  uniqueCandidates={workspace.allocationPreview!.uniqueCandidates}
                  duplicateRecords={workspace.allocationPreview!.duplicateRecords}
                  namesWithDuplicates={workspace.allocationPreview!.namesWithDuplicates}
                  worksheets={workspace.allocationPreview!.worksheets}
                />
                <FileUploadCard
                  title="Upload Client List"
                  description="Upload the client workbook for matching."
                  buttonText="Choose Client Workbook"
                  icon={<Users className="h-10 w-10 text-primary" />}
                  error={workspace.clientError}
                  onFileSelect={workspace.uploadClient}
                />
              </>
            )}

            {/* Stage 3 - Placement Mapping Evaluation Context Panels */}
            {workspace.allocationSummary && workspace.clientSummary && (
              <WorkspaceOverview
                allocationRecords={workspace.allocationSummary.totalRecords}
                clientRecords={workspace.clientSummary.totalRecords}
              />
            )}
            
            {workspace.matchingResult && (
              <MatchingDashboard
                matchedCount={workspace.matchingResult.matchedCount}
                unmatchedCount={workspace.matchingResult.unmatchedCount}
                duplicateCount={workspace.matchingResult.duplicateCount}
                matchRate={workspace.matchingResult.matchRate}
              />
            )}

            {workspace.matchingResult && (
              <div className="mt-12 flex justify-center">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View Report
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Production Independent Admission Ingestion Flow Section Component Block */
          <div className="space-y-6">
            <FileUploadCard
              title="Upload Client List"
              description="Upload your student list workbook. Columns can be in any sequence structure."
              buttonText="Process Admission List"
              icon={<Users className="h-10 w-10 text-primary" />}
              error={admissionError}
              accept=".xlsx"
              onFileSelect={handleAdmissionClientUpload}
            />
            
            <ErrorModal
              open={!!admissionError}
              title="Admission Processing Failed"
              message={admissionError ?? ""}
              onClose={() => setAdmissionError(null)}
            />
          </div>
        )}

        {/* Global Action Handlers */}
        <ErrorModal
          open={!!workspace.clientError}
          title="Import Failed"
          message={workspace.clientError ?? ""}
          onClose={workspace.clearClientError}
        />

        <ErrorModal
          open={!!workspace.allocationError}
          title="Import Failed"
          message={workspace.allocationError ?? ""}
          onClose={workspace.clearAllocationError}
        />

        {/* Footer */}

        {/* {workspace.matchingResult && (
          <ReportViewer
            allocation={workspace.allocationPreview!}
            client={workspace.clientSummary!}
            result={workspace.matchingResult}
          />
        )} */}
        {/* {workspace.matchingResult && (
          <DuplicateResolution
            duplicates={
              workspace.matchingResult.duplicateMatches
            }
            onResolve={(client, allocation) =>
              workspace.resolveDuplicate({
                client,
                selectedAllocation: allocation,
              })
            }
          />
        )} */}
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