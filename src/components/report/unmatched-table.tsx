"use client";

import { UnmatchedRecord } from "@/types/matching";

interface UnmatchedTableProps {
  records: UnmatchedRecord[];
}

export function UnmatchedTable({
  records,
}: UnmatchedTableProps) {

  if (records.length === 0) {
    return null;
  }

  return (

    <section className="section-card">

      <div className="mb-6 p-4">

        <h2 className="text-xl font-semibold">
          Unmatched Candidates
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          These candidates could not be matched to any
          allocation record.
        </p>

      </div>

      <div className="overflow-x-auto px-4 pb-4">

        <table className="w-full table-fixed border-collapse text-sm">

          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "52%" }} />
            <col style={{ width: "40%" }} />
          </colgroup>

          <thead>

            <tr className="bg-red-500/10">

              <th className="border px-4 py-3 text-center font-semibold">
                S/N
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Candidate Name
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {records.map((record) => (

              <tr
                key={`${record.client.worksheetName}-${record.client.rowNumber}`}
                className="hover:bg-red-50/30"
              >

                <td className="border px-4 py-3 text-center">
                  {record.client.serialNumber}
                </td>

                <td className="border px-4 py-3 font-medium break-words">
                  {record.client.name}
                </td>

                <td className="border px-4 py-3">
                    <span className="inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600">
                        No allocation found
                    </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}