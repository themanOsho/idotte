"use client";
import {
  FileSpreadsheet,
  History,
  Users,
} from "lucide-react";
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
          <p className="page-description max-w-lg mx-auto">
            Generate examination placement reports from allocation datasets and client lists in minutes. A <span className="font-medium text-foreground">Mrs Olujobi</span> software tool.
          </p>
        </section>
        {/* Upload */}
        {/* Stage 1 */}
        {!workspace.allocationSummary && (
          <FileUploadCard
            title="Upload Dataset"
            description="Upload the allocation workbook to begin."
            buttonText="Choose Workbook"
            icon={<FileSpreadsheet className="h-10 w-10 text-primary" />}
            onFileSelect={workspace.uploadAllocation}
          />
        )}
        {/* Stage 2 */}
        {workspace.allocationSummary &&
        !workspace.clientSummary && (
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
              onFileSelect={workspace.uploadClient}
            />
          </>
        )}
        {/* Stage 3 */}
        {workspace.allocationSummary &&
        workspace.clientSummary && (
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
        {/* {workspace.matchingResult &&
          workspace.matchingResult.duplicateCount > 0 && (
            <DuplicateReview
              duplicates={
                workspace.matchingResult.duplicateMatches
              }
            />
        )} */}
        {/* plcement button */}
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