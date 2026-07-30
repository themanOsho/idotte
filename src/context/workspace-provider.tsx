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
import { DuplicateResolution } from "@/types/resolution";


export interface WorkspaceContextValue extends WorkspaceState{
  allocationError:string|null;
  clientError:string|null;

  uploadAllocation:(file:File)=>Promise<void>;
  uploadClient:(file:File)=>Promise<void>;

  clearAllocationError:()=>void;
  clearClientError:()=>void;

  resolveDuplicate:(resolution:DuplicateResolution)=>void;
  runMatching:()=>Promise<void>;
  resetWorkspace:()=>void;
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

  const [
    duplicateResolutions,
    setDuplicateResolutions,
  ] = useState<DuplicateResolution[]>([]);

  const [uploadStage, setUploadStage] =
    useState<UploadStage>("idle");

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [allocationError,setAllocationError]=
    useState<string|null>(null);

  const [clientError,setClientError]=
    useState<string|null>(null);    

  const [isBusy, setIsBusy] =
    useState(false);

  async function uploadAllocation(file:File){

    try{

      setAllocationError(null);
      setIsBusy(true);

      const result=await processAllocationWorkbook(
        file,
        progress=>{
          setUploadStage(progress.stage);
          setUploadMessage(progress.message);
          setUploadProgress(progress.progress);
        }
      );

      setAllocationSummary(result.summary);
      setAllocationIndex(result.index);
      setAllocationPreview(result.preview);

      await new Promise(resolve=>setTimeout(resolve,800));

      setUploadStage("idle");

    }catch(error){

      if(process.env.NODE_ENV==="development"){
        console.error(error);
      }

      setAllocationError(
        error instanceof Error
          ? error.message
          : "Unable to import allocation workbook."
      );

      setUploadStage("error");

    }finally{

      setIsBusy(false);

    }

  }

  async function uploadClient(file:File){

    try{

      setClientError(null);
      setIsBusy(true);

      const result=await processClientWorkbook(
        file,
        progress=>{
          setUploadStage(progress.stage);
          setUploadMessage(progress.message);
          setUploadProgress(progress.progress);
        }
      );

      const summary=result.summary;

      setClientSummary(summary);

      if(allocationIndex){

        const response=await processMatching(
          allocationIndex,
          summary,
          progress=>{
            setUploadStage(progress.stage);
            setUploadMessage(progress.message);
            setUploadProgress(progress.progress);
          }
        );

        setMatchingResult(response.result);

      }

      await new Promise(resolve=>setTimeout(resolve,800));

      setUploadStage("idle");

    }catch(error){

      if(process.env.NODE_ENV==="development"){
        console.error(error);
      }

      setClientError(
        error instanceof Error
          ? error.message
          : "Unable to import client workbook."
      );

      setUploadStage("error");

    }finally{

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

    const report =
      generateReport(response.result);

    console.log("========== REPORT ==========");

    console.table(report);

    // log to Console
    console.log("========== MATCHING ==========");

    console.log(response.result);

    console.table(response.result.matched);

    console.table(response.result.unmatched);

    console.log(response.result);
    console.log(
      "Duplicate Matches:",
      response.result.duplicateMatches
    );

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 800)
    );

    setUploadStage("idle");

    } finally {

      setIsBusy(false);

    }

  }

    function resolveDuplicate(
      resolution: DuplicateResolution
    ) {

      setDuplicateResolutions((previous) => {

        const filtered = previous.filter(
          (item) =>
            item.client.name !== resolution.client.name
        );

        return [
          ...filtered,
          resolution,
        ];

      });

    }

  function clearAllocationError(){
    setAllocationError(null);
  }

  function clearClientError(){
    setClientError(null);
  }

  function resetWorkspace(){

    setAllocationSummary(null);
    setAllocationPreview(null);
    setAllocationIndex(null);

    setClientSummary(null);

    setMatchingResult(null);

    setDuplicateResolutions([]);

    setAllocationError(null);
    setClientError(null);

    setUploadStage("idle");
    setUploadMessage("");
    setUploadProgress(0);

    setIsBusy(false);

  }

  return (

  <WorkspaceContext.Provider
    value={{
      allocationSummary,
      allocationPreview,
      allocationIndex,

      clientSummary,
      matchingResult,

      clearAllocationError,
      clearClientError,

      duplicateResolutions,

      allocationError,
      clientError,

      uploadStage,
      uploadMessage,
      uploadProgress,

      isBusy,

      uploadAllocation,
      uploadClient,

      resolveDuplicate,

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