"use client";

import { DuplicateMatch } from "@/types/matching";

interface DuplicateTableProps {
  duplicates: DuplicateMatch[];
}

export function DuplicateTable({
  duplicates,
}: DuplicateTableProps) {

  if (duplicates.length === 0) {
    return null;
  }

  return (

    <section className="section-card">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Duplicate Candidates
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          These candidates matched multiple allocation records.
          All possible matches will appear in the exported report
          for manual verification.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full table-fixed border-collapse text-sm">

          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>

          <thead>

            <tr className="bg-amber-500/10">

              <th className="border px-4 py-3 text-center font-semibold">
                S/N
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Candidate Name
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Candidate ID
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Feeder School
              </th>

              <th className="border px-4 py-3 text-left font-semibold">
                Examination Centre
              </th>

            </tr>

          </thead>

          <tbody>

            {duplicates.map((duplicate) =>

              duplicate.allocations.map((allocation, index) => (

                <tr
                  key={`${duplicate.client.worksheetName}-${duplicate.client.rowNumber}-${allocation.candidateId}`}
                  className={
                    index === 0
                      ? "border-t-2 border-t-amber-500 bg-amber-50/40"
                      : ""
                  }
                >

                  <td className="border px-4 py-3 text-center">

                    {index === 0
                      ? duplicate.client.serialNumber
                      : ""}

                  </td>

                  <td className="border px-4 py-3 font-medium break-words">

                    {index === 0
                      ? duplicate.client.name
                      : ""}

                  </td>

                  <td className="border px-4 py-3 font-mono text-xs whitespace-nowrap">

                    {allocation.candidateId}

                  </td>

                  <td className="border px-4 py-3 break-words">

                    {allocation.schoolName}

                  </td>

                  <td className="border px-4 py-3 break-words">

                    {allocation.centreName}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>

  );

}