"use client";

import { MatchedRecord } from "@/types/matching";

interface MatchedTableProps {
  records: MatchedRecord[];
}

export function MatchedTable({
  records,
}: MatchedTableProps) {
  return (
    <section className="section-card">

      <div className="mb-6 p-4">
        <h2 className="text-xl font-semibold">
          Matched Candidates
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Candidates with exactly one confirmed placement.
        </p>
      </div>

      <div className="max-sm:overflow-x-auto sm:overflow-x-visible px-4 pb-4 rounded-xl border border-border">
        <table className="sm:min-w-full sm:w-full w-[1000px] lg:table-fixed border-collapse text-sm print:min-w-0">

            <colgroup>
                <col style={{ width: "6%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "24%" }} />
            </colgroup>

          <thead>
            <tr className="bg-muted/40">
              <th className="whitespace-wrap border px-4 py-3 text-center font-semibold">
                S/N
              </th>

              <th className="whitespace-wrap border px-4 py-3 text-left font-semibold">
                Candidate Name
              </th>

              <th className="whitespace-wrap border px-4 py-3 text-left font-semibold">
                Candidate ID
              </th>

              <th className="whitespace-wrap border px-4 py-3 text-left font-semibold">
                Feeder School
              </th>

              <th className="whitespace-wrap border px-4 py-3 text-left font-semibold">
                Examination Centre
              </th>
            </tr>
          </thead>

          <tbody>

            {records.map((record) => (

              <tr
                key={`${record.client.worksheetName}-${record.client.rowNumber}`}
                className="transition-colors hover:bg-muted/30"
              >

                <td className="border px-4 py-3 text-center">
                    {record.client.serialNumber}
                </td>

                <td className="border px-4 py-3 font-medium break-words">
                {record.client.name}
                </td>

                <td className="border px-4 py-3 whitespace-nowrap">
                {record.allocation.candidateId}
                </td>

                <td className="border px-4 py-3 break-words">
                {record.allocation.schoolName}
                </td>

                <td className="border px-4 py-3 break-words">
                {record.allocation.centreName}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}