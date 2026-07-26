"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface AllocationUploadProps {
  onFileSelect: (file: File) => void;
}

export function AllocationUpload({
  onFileSelect,
}: AllocationUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChooseFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
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
        onChange={handleFileChange}
      />

      <Button size="lg" className="cursor-pointer" onClick={handleChooseFile}>
        Choose Excel File
      </Button>
    </>
  );
}