"use client";

import { RotateCcw } from "lucide-react";

interface AdmissionErrorModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function AdmissionErrorModal({
  open,
  title,
  message,
  onClose,
}: AdmissionErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
      <div className="w-full border-2 border-primary max-w-lg rounded-2xl bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-destructive">{title}</h2>
        <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
          {message}
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}