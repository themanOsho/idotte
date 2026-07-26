import {
  FileSpreadsheet,
  Files,
  Users,
  Copy,
  AlertTriangle,
} from "lucide-react";

interface WorkbookPreviewProps {
  fileName: string;

  sheetCount: number;

  totalRecords: number;

  uniqueCandidates: number;

  duplicateRecords: number;

  namesWithDuplicates: number;

  worksheets: {
    name: string;
    rowCount: number;
  }[];
}

export function WorkbookPreview({
  fileName,
  sheetCount,
  totalRecords,
  uniqueCandidates,
  duplicateRecords,
  namesWithDuplicates,
  worksheets,
}: WorkbookPreviewProps) {
  return (
    <section className="space-y-8">

      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Workbook Imported
            </h2>

            <p className="text-sm text-muted-foreground">
              {fileName}
            </p>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Records"
          value={totalRecords}
        />

        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Unique Candidates"
          value={uniqueCandidates}
        />

        <StatCard
          icon={<Copy className="h-5 w-5" />}
          label="Duplicate Records"
          value={duplicateRecords}
        />

        <StatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Names with Duplicates"
          value={namesWithDuplicates}
        />

      </div>

      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">

        <div className="flex items-center gap-2 border-b border-border px-6 py-5">

          <Files className="h-5 w-5 text-primary" />

          <h3 className="font-semibold">
            Worksheets
          </h3>

        </div>

        <div>

          {worksheets.map((sheet) => (

            <div
              key={sheet.name}
              className="flex items-center justify-between border-b border-border/50 px-6 py-4 transition-colors hover:bg-primary/5 last:border-0"
            >

              <div>

                <p className="font-medium">
                  {sheet.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  Worksheet
                </p>

              </div>

              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">

                {sheet.rowCount.toLocaleString()}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          {icon}
        </div>

      </div>

      <p className="mt-6 text-3xl font-bold tracking-tight">

        {value.toLocaleString()}

      </p>

      <p className="mt-1 text-sm text-muted-foreground">

        {label}

      </p>

    </div>
  );
}