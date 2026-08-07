"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdmissionReportViewer } from "@/admission/components/report/AdmissionReportViewer";
import { AdmissionReportData } from "@/admission/types/admission-report";

export default function AdmissionReportPage() {
  const [data, setData] = useState<AdmissionReportData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
        const raw = localStorage.getItem("admission-report");
        if (raw) {
        setData(JSON.parse(raw) as AdmissionReportData);
        }
    } catch {
        setData(null);
    } finally {
        setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <main className="page-boxed py-24">
        <div className="section-card p-24 text-center">
          <p className="text-muted-foreground">Loading report…</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="page-boxed py-24">
        <div className="section-card p-24 text-center">
          <h1 className="pt-24 text-2xl font-semibold">No Report Available</h1>
          <p className="mt-3 pb-24 text-muted-foreground">
            Generate an admission report from the workspace before opening the
            print preview.
          </p>
          <Link
            href="/"
            className="text-sm text-primary underline hover:text-foreground"
          >
            ← Back to Workspace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-boxed py-12">
      <AdmissionReportViewer data={data} />
    </main>
  );
}