"use client";

import { ReportViewer } from "@/components/report/report-viewer";
import { useWorkspace } from "@/hooks/use-workspace";

export default function ReportPage() {
  const workspace = useWorkspace();

  if (
    !workspace.matchingResult ||
    !workspace.allocationPreview ||
    !workspace.clientSummary
  ) {
    return (
      <main className="page-boxed py-24">
        <div className="section-card text-center p-24">
          <h1 className="text-2xl font-semibold pt-24">
            No Report Available
          </h1>

          <p className="mt-3 text-muted-foreground pb-24">
            Generate a placement report from the workspace
            before opening the print preview.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-boxed py-12">
      <ReportViewer
        allocation={workspace.allocationPreview}
        client={workspace.clientSummary}
        result={workspace.matchingResult}
      />
    </main>
  );
}