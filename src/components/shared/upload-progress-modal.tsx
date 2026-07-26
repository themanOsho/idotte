"use client";

import {
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface UploadProgressModalProps {
  open: boolean;
  title: string;
  progress: number;
  complete: boolean;
}

export function UploadProgressModal({
  open,
  title,
  progress,
  complete,
}: UploadProgressModalProps) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        transition-all duration-300
        ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }
      `}
    >
      <div
        className={`
          w-full max-w-md rounded-3xl border border-border
          bg-card p-8 shadow-2xl
          transition-all duration-300
          ${
            open
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-95"
          }
        `}
      >
        <div className="flex flex-col items-center text-center">

          {/* Icon */}
          <div className="mb-6">

            {complete ? (
              <CheckCircle2 className="h-14 w-14 text-primary" />
            ) : (
              <Loader2 className="h-14 w-14 animate-spin text-primary" />
            )}

          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold tracking-tight">
            {complete ? "Completed" : title}
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm text-muted-foreground">
            {complete
              ? "Allocation dataset processed successfully."
              : "Please wait while Idotte processes your workbook."}
          </p>

          {/* Progress */}
          <div className="mt-8 w-full">

            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}