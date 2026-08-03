"use client";

import { Printer } from "lucide-react";

export function PrintReportButton() {
  return (
    <button
      className="group btn-secondary relative flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out text-primary hover:text-foreground no-print cursor-pointer"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      
      <span className="text-sm font-medium">Print Report</span>

      {/* Underline bar with smooth zoom-in and fade-out outro */}
      <span className="absolute bottom-0 left-1/2 h-[2px] w-3/4 -translate-x-1/2 scale-x-0 bg-primary hover:muted-background opacity-0 transition-all duration-300 ease-out subpixel-antialiased group-hover:scale-x-100 group-hover:opacity-100" />
    </button>
  );
}