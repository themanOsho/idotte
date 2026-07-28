"use client";

export function PrintReportButton() {

  return (

    <button
      className="btn-primary no-print"
      onClick={() => window.print()}
    >
      Print Report
    </button>

  );

}