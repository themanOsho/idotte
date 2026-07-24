import { FileSpreadsheet, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="page-container flex min-h-screen items-center justify-center py-12">
      <div className="page-boxed space-y-10">

        {/* Hero */}

        <section className="page-header items-center text-center">

          <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Idotte
          </div>

          <h1 className="page-title max-w-3xl">
            Placement Report Generator
          </h1>

          <p className="page-description max-w-xl text-base">
            Generate examination placement reports from allocation datasets
            and client candidate lists in minutes instead of hours.
          </p>

        </section>

        {/* Upload */}

        <section className="section-card">

          <div className="upload-zone">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

              <FileSpreadsheet className="h-8 w-8 text-primary" />

            </div>

            <h2 className="text-xl font-semibold">
              Upload Allocation Dataset
            </h2>

            <p className="mt-3 max-w-md text-center text-sm text-muted-foreground leading-6">
              Upload the official Allocation workbook to begin generating
              placement reports.
            </p>

            <Button size="lg" className="mt-8 gap-2">

              <ArrowUpFromLine className="h-4 w-4" />

              Choose Excel File

            </Button>

            <p className="mt-5 text-xs text-muted-foreground">
              Supports .xlsx files
            </p>

          </div>

        </section>

        <p className="text-center text-xs text-muted-foreground">
          Idotte v0.1.0
        </p>

      </div>
    </main>
  );
}