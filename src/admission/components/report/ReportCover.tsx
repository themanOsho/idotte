"use client";

import { AdmissionReportData } from "../../types/admission-report";
import { ReportFooter } from "./ReportFooter";

interface ReportCoverProps {
  data: AdmissionReportData;
}

export function ReportCover({ data }: ReportCoverProps) {
  return (
    <section className="section-card space-y-10">
      <section className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Report Information</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="w-56 border bg-muted/40 px-4 py-3 font-medium">
                Workbook
              </td>
              <td className="border px-4 py-3">{data.clientFileName}</td>
            </tr>
            <tr>
              <td className="border bg-muted/40 px-4 py-3 font-medium">
                Worksheets
              </td>
              <td className="border px-4 py-3">{data.clientSheetCount}</td>
            </tr>
            {/* <tr>
              <td className="border bg-muted/40 px-4 py-3 font-medium">
                Records
              </td>
              <td className="border px-4 py-3">
                {data.clientRecordCount.toLocaleString()}
              </td>
            </tr> */}
            <tr>
              <td className="border bg-muted/40 px-4 py-3 font-medium">
                Academic Session
              </td>
              <td className="border px-4 py-3">{data.session}</td>
            </tr>
            <tr>
              <td className="border bg-muted/40 px-4 py-3 font-medium">
                Generated On
              </td>
              <td className="border px-4 py-3">{data.generatedOn}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Admission Summary</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/40">
              <th className="border px-4 py-3 text-left">Metric</th>
              <th className="border px-4 py-3 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-3">Total Students</td>
              <td className="border px-4 py-3 font-medium">
                {data.total.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-3">Admitted</td>
              <td className="border px-4 py-3 font-medium">
                {data.admitted.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-3">Redirected</td>
              <td className="border px-4 py-3 font-medium">
                {data.redirected.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-3">Not Admitted</td>
              <td className="border px-4 py-3 font-medium">
                {data.notAdmitted.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <ReportFooter generatedOn={data.generatedOn} />
    </section>
  );
}