"use client";

import { DuplicateMatch } from "@/types/matching";
import { AllocationRecord } from "@/types/allocation";
import { ClientRecord } from "@/types/client";

import { DuplicateCard } from "./duplicate-card";

interface DuplicateResolutionProps {

  duplicates: DuplicateMatch[];

  onResolve: (
    client: ClientRecord,
    allocation: AllocationRecord
  ) => void;

}

export function DuplicateResolution({
  duplicates,
  onResolve,
}: DuplicateResolutionProps) {

  if (duplicates.length === 0) {

    return null;

  }

  return (

    <section className="space-y-6">

      <div>

        <h2 className="text-2xl font-bold">

          Needs Attention

        </h2>

        <p className="text-muted-foreground">

          {duplicates.length.toLocaleString()} candidate
          {duplicates.length > 1 ? "s require" : " requires"} manual resolution.

        </p>

      </div>

      <div className="grid gap-6">

        {duplicates.map((duplicate) => (

          <DuplicateCard

            key={duplicate.client.name}

            duplicate={duplicate}

            onResolve={(allocation) =>

              onResolve(
                duplicate.client,
                allocation
              )

            }

          />

        ))}

      </div>

    </section>

  );

}