import { UnmatchedRecord } from "@/types/matching";
interface Props {
  records: UnmatchedRecord[];
}
export function UnmatchedTable({
  records,
}: Props) {
  if (records.length === 0) return null;
  return (
    <div className="section-card">
      <h2 className="mb-5 text-lg font-semibold">
        Unmatched Candidates
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">
                Name
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={index}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3">
                  {record.client.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}