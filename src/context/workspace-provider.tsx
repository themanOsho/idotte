"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { WorkspaceState } from "@/types/workspace";
import { AllocationIndexResult, buildAllocationIndex } from "@/engine/allocation/indexer";
import { parseAllocationWorkbook } from "@/engine/allocation/parser";
import { WorkbookPreview } from "@/types/preview";
import { MatchingResult } from "@/types/matching";
import { ClientWorkbookSummary } from "@/types/client";
import { UploadStage } from "@/types/upload";

export interface WorkspaceContextValue
  extends WorkspaceState {
  uploadAllocation: (
    file: File
  ) => Promise<void>;

  uploadClient: (
    file: File
  ) => Promise<void>;

  resetWorkspace: () => void;
}

const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(
    null
  );

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allocationSummary, setAllocationSummary] =
    useState<WorkspaceState["allocationSummary"]>(null);

  const [allocationPreview, setAllocationPreview] =
    useState<WorkbookPreview | null>(null);

  const [allocationIndex, setAllocationIndex] =
    useState<AllocationIndexResult | null>(null);

  const [clientSummary, setClientSummary] =
    useState<ClientWorkbookSummary | null>(null);

  const [matchingResult, setMatchingResult] =
    useState<MatchingResult | null>(null);

  const [uploadStage, setUploadStage] =
    useState<UploadStage>("idle");

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [isBusy, setIsBusy] =
    useState(false);

  async function uploadAllocation(
    file: File
  ) {

    try {

      setIsBusy(true);

      setUploadStage("reading");
      setUploadMessage("Reading workbook...");
      setUploadProgress(10);

      const summary =
        await parseAllocationWorkbook(file);

      setAllocationSummary(summary);

      setUploadStage("indexing");
      setUploadMessage("Building allocation index...");
      setUploadProgress(75);

        const index =
        buildAllocationIndex(
            summary.worksheets.flatMap(
            (sheet) => sheet.records
            )
        );

      setAllocationIndex(index);

    setAllocationPreview({
        fileName: file.name,
        sheetCount: summary.sheetCount,
        totalRecords: summary.totalRecords,

        uniqueCandidates: index.uniqueNames,

        duplicateRecords: index.duplicateRecords,

        namesWithDuplicates: index.namesWithDuplicates,

        worksheets: summary.worksheets.map((sheet) => ({
            name: sheet.name,
            rowCount: sheet.rowCount,
        })),
    });

    setUploadStage("complete");
    setUploadMessage("Upload completed.");
    setUploadProgress(100);

    // Keep the success state visible briefly.
    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    setUploadStage("idle");

    } catch (error) {

      console.error(error);

      setUploadStage("error");

    } finally {

      setIsBusy(false);

    }

  }

  async function uploadClient(
    file: File
  ) {

    console.log(file);

    /**
     * We'll implement this next.
     */

  }

  function resetWorkspace() {

    setAllocationSummary(null);

    setAllocationPreview(null);

    setAllocationIndex(null);

    setClientSummary(null);

    setMatchingResult(null);

    setUploadStage("idle");

    setIsBusy(false);

    setUploadMessage("");

    setUploadProgress(0);

  }

  return (

    <WorkspaceContext.Provider
        value={{
        allocationSummary,
        allocationPreview,
        allocationIndex,
        clientSummary,
        matchingResult,

        uploadStage,
        uploadMessage,
        uploadProgress,

        isBusy,

        uploadAllocation,
        uploadClient,
        resetWorkspace,
        }}
    >

      {children}

    </WorkspaceContext.Provider>

  );

}

export function useWorkspaceContext() {

  const context =
    useContext(WorkspaceContext);

  if (!context) {

    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider."
    );

  }

  return context;

}