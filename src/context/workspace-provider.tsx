"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { WorkspaceState } from "@/types/workspace";
import { AllocationIndexResult } from "@/engine/allocation/indexer";
import { processAllocationWorkbook } from "@/services/allocation-service";
import { WorkbookPreview } from "@/types/preview";
import { MatchingResult } from "@/types/matching";
import { ClientWorkbookSummary } from "@/types/client";
import { UploadStage } from "@/types/upload";
import { processClientWorkbook } from "@/services/client-service";
import { processMatching } from "@/services/matching-service";
import { generateReport } from "@/services/report-service";

export interface WorkspaceContextValue
  extends WorkspaceState {
  uploadAllocation: (
    file: File
  ) => Promise<void>;

  uploadClient: (
    file: File
  ) => Promise<void>;

  runMatching: () => Promise<void>;

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

    const result =
      await processAllocationWorkbook(
        file,
        (progress) => {

          setUploadStage(
            progress.stage
          );

          setUploadMessage(
            progress.message
          );

          setUploadProgress(
            progress.progress
          );

        }
      );

      setAllocationSummary(
        result.summary
      );

      setAllocationIndex(
        result.index
      );

      setAllocationPreview(
        result.preview
      );

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

    try {

      setIsBusy(true);

      const result =
        await processClientWorkbook(
          file,
          (progress) => {

            setUploadStage(
              progress.stage
            );

            setUploadMessage(
              progress.message
            );

            setUploadProgress(
              progress.progress
            );

          }
        );

      setClientSummary(
        result.summary
      );

      await new Promise(
        (resolve) =>
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

  async function runMatching() {

  if (
    !allocationIndex ||
    !clientSummary
  ) {
    return;
  }

  try {

    setIsBusy(true);

    const response =
      await processMatching(
        allocationIndex,
        clientSummary,
        (progress) => {

          setUploadStage(
            progress.stage
          );

          setUploadMessage(
            progress.message
          );

          setUploadProgress(
            progress.progress
          );

        }
      );

    setMatchingResult(
      response.result
    );

    // const report =
    //   generateReport(response.result);

    // console.log("========== REPORT ==========");

    // console.table(report);

    // // log to Console
    // console.log("========== MATCHING ==========");

    // console.log(response.result);

    // console.table(response.result.matched);

    // console.table(response.result.unmatched);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 800)
    );

    setUploadStage("idle");

  } finally {

    setIsBusy(false);

  }

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
        runMatching,
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