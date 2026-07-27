import { MatchedRecord } from "@/types/matching";
interface Props {
  records: MatchedRecord[];
}
export function MatchedTable({
  records,
}: Props) {
  return (
    <div className="section-card">
      <h2 className="mb-5 text-lg font-semibold">
        Matched Candidates
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">School</th>
              <th className="px-4 py-3 text-left">Centre</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={index}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3">
                  {record.allocation.fullName}
                </td>
                <td className="px-4 py-3">
                  {record.allocation.schoolName}
                </td>
                <td className="px-4 py-3">
                  {record.allocation.centreName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}