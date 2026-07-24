import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="page-container py-16">
      <section className="page-header">
        <span className="inline-flex w-fit items-center rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">
          IDOTTE
        </span>

        <h1 className="page-title">
          Placement Report Generator
        </h1>

        <p className="page-description">
          Generate examination placement reports from allocation datasets and
          client candidate lists in minutes instead of hours.
        </p>
      </section>

      <section className="section-card">
        <div className="upload-zone">
          <FileSpreadsheet className="mb-4 h-12 w-12 text-primary" />

          <h2 className="text-lg font-semibold">
            Upload Allocation Dataset
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Drag and drop an Excel workbook or browse your computer.
          </p>

          <Button className="mt-6">
            Choose Excel File
          </Button>
        </div>
      </section>
    </main>
  );
}