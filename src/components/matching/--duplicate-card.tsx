"use client";
import { useState } from "react";
import { AllocationRecord } from "@/types/allocation";
import { DuplicateMatch } from "@/types/matching";
import { Button } from "@/components/ui/button";
interface DuplicateCardProps {
  duplicate: DuplicateMatch;
  onResolve: (
    allocation: AllocationRecord
  ) => void;
}
export function DuplicateCard({
  duplicate,
  onResolve,
}: DuplicateCardProps) {
  const [selected, setSelected] =
    useState<number | null>(null);
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div>
        <h3 className="text-lg font-semibold">
          {duplicate.client.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {duplicate.allocations.length} possible allocation
          {duplicate.allocations.length > 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-6 space-y-4">
        {duplicate.allocations.map(
          (allocation, index) => (
            <label
              key={allocation.candidateId}
              className={`
                flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all
                ${
                  selected === index
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }
              `}
            >
              <input
                type="radio"
                checked={selected === index}
                onChange={() =>
                  setSelected(index)
                }
              />
              <div className="space-y-1">
                <p className="font-medium">
                  {allocation.schoolName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Candidate ID:
                  {" "}
                  {allocation.candidateId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Centre:
                  {" "}
                  {allocation.centreName}
                </p>
              </div>
            </label>
          )
        )}
      </div>
      <Button
        className="mt-6 w-full"
        disabled={selected === null}
        onClick={() => {
          if (selected === null) return;
          onResolve(
            duplicate.allocations[selected]
          );
        }}
      >
        Save Selection
      </Button>
    </div>
  );
}