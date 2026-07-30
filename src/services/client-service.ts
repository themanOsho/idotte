import { parseClientWorkbook } from "@/engine/client/parser";

import type { ClientWorkbookSummary } from "@/types/client";

export interface ClientServiceProgress{
  stage:"reading"|"parsing"|"preparing"|"complete";
  message:string;
  progress:number;
}

export interface ClientServiceResult{
  summary:ClientWorkbookSummary;
}

/**
 * Processes an uploaded Client workbook.
 */
export async function processClientWorkbook(
  file:File,
  onProgress?:(progress:ClientServiceProgress)=>void
):Promise<ClientServiceResult>{

  onProgress?.({
    stage:"reading",
    message:"Reading client workbook...",
    progress:2,
  });

  const summary=await parseClientWorkbook(
    file,
    progress=>{
      onProgress?.({
        stage:progress.stage,
        message:progress.message,
        progress:progress.progress,
      });
    }
  );

  onProgress?.({
    stage:"preparing",
    message:"Preparing client records...",
    progress:92,
  });

  onProgress?.({
    stage:"complete",
    message:"Client workbook imported.",
    progress:100,
  });

  return{
    summary,
  };

}