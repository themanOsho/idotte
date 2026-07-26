"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ClientUploadProps {
  onFileSelect: (file: File) => void;
}

export function ClientUpload({
  onFileSelect,
}: ClientUploadProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleChange}
      />

      <Button
        variant="outline"
        size="lg"
        onClick={() => inputRef.current?.click()}
      >
        Choose Client Workbook
      </Button>
    </>
  );
}