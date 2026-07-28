"use client";

export function PrintReportButton() {

  return (

    <button
      className="btn-primary no-print cursor-pointer"
      onClick={() => window.print()}
    >
      Print Report
    </button>

  );

}