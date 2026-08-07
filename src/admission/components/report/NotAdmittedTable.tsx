"use client";

import { AdmissionReportSchoolGroup } from "../../types/admission-report";

interface NotAdmittedTableProps {
  groups: AdmissionReportSchoolGroup[];
}

export function NotAdmittedTable({ groups }: NotAdmittedTableProps) {
  return (
    <section className="section-card space-y-8">
      <div className="mb-2 p-4">
        <h2 className="text-xl font-semibold">Not Admitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Students not found in the admission dataset.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="px-4 pb-6 text-sm text-muted-foreground">(None)</p>
      ) : (
        groups.map((group) => (
          <div key={`${group.schoolName}-${group.lga}`} className="space-y-3">
            <div className="px-4">
              <p className="font-semibold">School of Choice: {group.schoolName}</p>
              <p className="text-sm text-muted-foreground">LGA: {group.lga}</p>
            </div>

            <div className="mx-2 mb-2 max-sm:overflow-x-auto sm:overflow-x-visible md:mx-4 md:mb-4">
              <table className="w-[800px] border-collapse text-sm sm:min-w-full sm:w-full lg:table-fixed print:min-w-0">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "70%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-muted/40">
                    <th className="border px-4 py-3 text-center font-semibold">S/N</th>
                    <th className="border px-4 py-3 text-left font-semibold">Full Name</th>
                    <th className="border px-4 py-3 text-left font-semibold">Sex</th>
                  </tr>
                </thead>
                <tbody>
                  {group.records.map((record, idx) => (
                    <tr
                      key={`${record.clientName}-${idx}`}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="border px-4 py-3 text-center">
                        {String((record as any).clientSerialNumber ?? idx + 1)}
                      </td>
                      <td className="border px-4 py-3 font-medium break-words">
                        {record.clientName}
                      </td>
                      <td className="border px-4 py-3">
                        {(record as any).clientSex || record.sex || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </section>
  );
}