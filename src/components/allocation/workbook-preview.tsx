interface WorkbookPreviewProps {
  fileName: string;
  sheetCount: number;
  totalRecords: number;

  worksheets: {
    name: string;
    rowCount: number;
  }[];
}

export function WorkbookPreview({
  fileName,
  sheetCount,
  totalRecords,
  worksheets,
}: WorkbookPreviewProps) {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">
        Workbook Summary
      </h3>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>
          <strong>File:</strong> {fileName}
        </p>

        <p>
          <strong>Worksheets:</strong> {sheetCount}
        </p>

        <p>
          <strong>Total Records:</strong> {totalRecords}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3">Worksheet</th>
              <th className="px-4 py-3">Records</th>
            </tr>
          </thead>

          <tbody>
            {worksheets.map((sheet) => (
              <tr
                key={sheet.name}
                className="border-t"
              >
                <td className="px-4 py-3">
                  {sheet.name}
                </td>

                <td className="px-4 py-3">
                  {sheet.rowCount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}