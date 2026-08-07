"use client";

import { AdmissionReportSchoolGroup } from "../../types/admission-report";

interface RedirectedTableProps {
  groups: AdmissionReportSchoolGroup[];
}

export function RedirectedTable({ groups }: RedirectedTableProps) {
  return (
    <section className="section-card space-y-8">
      <div className="mb-2 p-4">
        <h2 className="text-xl font-semibold">Redirected Admission(s)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Students placed in a different school from their choice.
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="px-4 pb-6 text-sm text-muted-foreground">(None)</p>
      ) : (
        groups.map((group) => (
          <div key={`${group.schoolName}-${group.lga}`} className="space-y-3">
            <div className="px-4">
              <p className="font-semibold">School: {group.schoolName}</p>
              <p className="text-sm text-muted-foreground">LGA: {group.lga}</p>
            </div>

            <div className="mx-2 mb-2 max-sm:overflow-x-auto sm:overflow-x-visible md:mx-4 md:mb-4">
              <table className="w-[1100px] border-collapse text-sm sm:min-w-full sm:w-full lg:table-fixed print:min-w-0">
                <colgroup>
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "39%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-muted/40">
                    <th className="border px-4 py-3 text-center font-semibold">S/N</th>
                    <th className="border px-4 py-3 text-left font-semibold">Admission No</th>
                    <th className="border px-4 py-3 text-left font-semibold">Full Name</th>
                    <th className="border px-4 py-3 text-left font-semibold">Sex</th>
                    <th className="border px-4 py-3 text-left font-semibold">School of Choice</th>
                  </tr>
                </thead>
                <tbody>
                  {group.records.map((record, idx) => {
                    const choiceName =
                      (record as any).matchedSchoolChoice ||
                      record.clientSchoolChoice ||
                      "N/A";
                    const choiceLga = (record as any).matchedChoiceLga || "N/A";
                    return (
                      <tr
                        key={`${record.admissionNumber}-${idx}`}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="border px-4 py-3 text-center">
                          {String((record as any).clientSerialNumber ?? idx + 1)}
                        </td>
                        <td className="border px-4 py-3 whitespace-nowrap">
                          {record.admissionNumber || "N/A"}
                        </td>
                        <td className="border px-4 py-3 font-medium break-words">
                          {record.clientName}
                        </td>
                        <td className="border px-4 py-3">
                          {record.sex || (record as any).clientSex || "N/A"}
                        </td>
                        <td className="border px-4 py-3 break-words">
                          {choiceName}, {choiceLga}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </section>
  );
}