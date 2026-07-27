"use client";
import { useEffect, useState } from "react";
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
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [open]);
  if (!visible) return null;
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm
        transition-opacity duration-300
        ${
          open
            ? "opacity-100"
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
              : "translate-y-3 scale-95"
          }
        `}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-tight">
              {complete ? "Completed" : title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {complete
                ? "Allocation dataset processed successfully."
                : "Please wait while Idotte processes your workbook."}
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Status</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
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