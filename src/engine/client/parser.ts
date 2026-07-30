import ExcelJS from "exceljs";

import { CLIENT_HEADERS } from "./constants";
import { normalizeHeader } from "@/lib/header";
import { getHeaderLabel } from "@/lib/header-label";

import {
  ClientRecord,
  ClientWorkbookSummary,
  ClientWorksheet,
} from "@/types/client";

export interface ClientParserProgress{
  stage:"reading"|"parsing";
  message:string;
  progress:number;
}

/**
 * Parses a client workbook into Idotte's internal model.
 */
export async function parseClientWorkbook(
  file:File,
  onProgress?:(progress:ClientParserProgress)=>void
):Promise<ClientWorkbookSummary>{

  onProgress?.({
    stage:"reading",
    message:"Reading workbook...",
    progress:5,
  });

  const workbook=new ExcelJS.Workbook();

  const buffer=await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  onProgress?.({
    stage:"reading",
    message:"Workbook loaded.",
    progress:20,
  });

  const worksheets:ClientWorksheet[]=[];
  let totalRecords=0;

  const totalSheets=workbook.worksheets.length;

  for(let sheetIndex=0;sheetIndex<totalSheets;sheetIndex++){

    const worksheet=workbook.worksheets[sheetIndex];

    if(worksheet.rowCount===0) continue;

    const records:ClientRecord[]=[];
    const headerRow=worksheet.getRow(1);
    const headerMap=new Map<string,number>();

    headerRow.eachCell((cell,columnNumber)=>{
      const header=normalizeHeader(String(cell.value??""));

      if(header){
        headerMap.set(header,columnNumber);
      }
    });

    const requiredHeaders=Object.values(CLIENT_HEADERS);

    const missingHeaders=requiredHeaders.filter(
      header=>!headerMap.has(header)
    );

    if(missingHeaders.length>0){
      throw new Error([
        "Client workbook could not be imported.",
        "",
        "Worksheet:",
        worksheet.name,
        "",
        "Missing columns",
        "",
        ...missingHeaders.map(header=>`• ${getHeaderLabel(header)}`)
      ].join("\n"));
    }

    const serialNumberColumn=headerMap.get(CLIENT_HEADERS.SERIAL_NUMBER)!;
    const nameColumn=headerMap.get(CLIENT_HEADERS.NAME)!;

    worksheet.eachRow((row,rowNumber)=>{

      if(rowNumber===1) return;
      if(!row.hasValues) return;

      records.push({
        serialNumber:String(row.getCell(serialNumberColumn).value??"").trim(),
        rowNumber,
        worksheetName:worksheet.name,
        name:String(row.getCell(nameColumn).value??"").trim(),
      });

    });

    totalRecords+=records.length;

    worksheets.push({
      name:worksheet.name,
      rowCount:records.length,
      records,
    });

    onProgress?.({
      stage:"parsing",
      message:`Parsed worksheet ${sheetIndex+1} of ${totalSheets}`,
      progress:20+Math.round(((sheetIndex+1)/totalSheets)*60),
    });

  }

  onProgress?.({
    stage:"parsing",
    message:"Workbook parsed successfully.",
    progress:80,
  });

  return{
    sheetCount:worksheets.length,
    totalRecords,
    worksheets,
  };

}