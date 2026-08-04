import * as XLSX from "xlsx";
import { ClientListInputRow } from "./map-client";

function normalizeHeader(text: string): string {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export async function parseClientExcelFile(file: File): Promise<ClientListInputRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const extractedRows: ClientListInputRow[] = [];

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

          let snIndex = -1;
          let nameIndex = -1;
          let schoolIndex = -1;
          let sexIndex = -1;
          let headerRowIndex = -1;

          const rowsToScan = Math.min(rawRows.length, 15);
          for (let i = 0; i < rowsToScan; i++) {
            const row = rawRows[i];
            if (!row || row.length === 0) continue;

            const cleanCells = row.map((cell) =>
              cell !== undefined && cell !== null ? normalizeHeader(String(cell)) : ""
            );

            const foundSN = cleanCells.findIndex((c) => ["sn", "serialno", "serialnumber"].includes(c));
            const foundName = cleanCells.findIndex((c) => ["name", "fullname"].includes(c));
            const foundSchool = cleanCells.findIndex((c) => ["schoolofchoice", "schofchoice"].includes(c));
            const foundSex = cleanCells.findIndex((c) => ["sex", "gender"].includes(c));

            if (foundSN !== -1 && foundName !== -1 && foundSchool !== -1) {
              snIndex = foundSN;
              nameIndex = foundName;
              schoolIndex = foundSchool;
              sexIndex = foundSex;
              headerRowIndex = i;
              break;
            }
          }

          if (snIndex === -1 || nameIndex === -1 || schoolIndex === -1) {
            continue;
          }

          for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
            const row = rawRows[i];
            if (!row || row.length === 0) continue;

            const snRaw = row[snIndex];
            const nameRaw = row[nameIndex];
            const schoolRaw = row[schoolIndex];
            const sexRaw = sexIndex !== -1 ? row[sexIndex] : undefined;

            const snCell = snRaw !== undefined && snRaw !== null ? String(snRaw).trim() : "";
            const nameCell = nameRaw !== undefined && nameRaw !== null ? String(nameRaw).trim() : "";
            const schoolCell = schoolRaw !== undefined && schoolRaw !== null ? String(schoolRaw).trim() : "";
            const sexCell = sexRaw !== undefined && sexRaw !== null ? String(sexRaw).trim().toUpperCase() : "N/A";

            if (nameCell !== "" && schoolCell !== "") {
              extractedRows.push({
                sN: snCell || "",
                name: nameCell.toUpperCase(),
                schoolOfChoice: schoolCell.toUpperCase(),
                sex: sexCell,
                sheetName,
              });
            }
          }
        }

        if (extractedRows.length === 0) {
          throw new Error("No valid data found in any sheet. Missing required columns: S/N, Name, School of Choice.");
        }

        resolve(extractedRows);
      } catch (error: any) {
        reject(new Error(error.message || "An error occurred while parsing the spreadsheet layout."));
      }
    };

    reader.onerror = () => reject(new Error("File ingestion reading data byte failure."));
    reader.readAsArrayBuffer(file);
  });
}
