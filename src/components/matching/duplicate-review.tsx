"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { DuplicateMatch } from "@/types/matching";

interface DuplicateReviewProps {
  duplicates: DuplicateMatch[];
}

export function DuplicateReview({ duplicates }: DuplicateReviewProps) {
  return (
    <section className="section-card w-full max-w-full px-!4 md:px-!6">
      
      {/* Header section with responsive spacing */}
      <div className="md:mb-8 p-4">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          Duplicate Review
        </h2>
        <p className="mt-1.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
          {duplicates.length} candidate{duplicates.length === 1 ? "" : "s"} have
          multiple matching allocation records. All possible matches will be included in
          the generated placement report for manual verification.
        </p>
      </div>

      {/* Accordion container */}
      <Accordion multiple className="space-y-3 !border-0 md:space-y-4">
        {duplicates.map((duplicate) => {
          const key = `${duplicate.client.worksheetName}-${duplicate.client.rowNumber}`;

          return (
            <AccordionItem
              key={key}
              value={key}
              className="overflow-hidden rounded-xl md:rounded-2xl border bg-card mx-4"
            >
              {/* Trigger area optimized for touch targets and mobile wrapping */}
              <AccordionTrigger className="px-4 py-4 md:px-6 md:py-5 hover:no-underline transition-all">
                <div className="flex flex-col items-start text-left w-full pr-2">
                  <h3 className="font-semibold text-sm md:text-base leading-snug">
                    {duplicate.client.name}
                  </h3>
                  
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    S/N {duplicate.client.serialNumber}
                    {" • "}
                    {duplicate.client.worksheetName}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 md:gap-2">
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] md:text-xs font-medium text-amber-600">
                      Duplicate
                    </span>
                    <span className="text-[11px] md:text-xs text-muted-foreground">
                      {duplicate.allocations.length} Possible Allocation
                      {duplicate.allocations.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              {/* Content area: maximized mobile width by dropping px-4 down to px-2 */}
              <AccordionContent className="space-y-4 px-2 md:px-6 pb-4 md:pb-6">
                {duplicate.allocations.map((allocation, index) => (
                  <div
                    key={allocation.candidateId}
                    className="rounded-lg md:rounded-xl border bg-background p-3.5 md:p-5 shadow-sm"
                  >
                    {/* Header info inside card */}
                    <div className="mb-4 flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center border-b border-muted pb-3">
                      <h4 className="font-semibold text-xs md:text-sm uppercase tracking-wider text-primary">
                        Allocation {index + 1}
                      </h4>
                      {/* <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] md:text-xs font-medium text-primary">
                        ID: {allocation.candidateId}
                      </span> */}
                    </div>

                    {/* Highly responsive 2-column or 1-column layout */}
                    <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-semibold block">
                          Candidate ID
                        </span>
                        <p className="text-xs md:text-sm font-medium break-words">
                          {allocation.candidateId}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 block">
                          LED Name
                        </span>
                        <p className="text-xs md:text-sm break-words">
                          {allocation.ledName}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 block">
                          Feeder School
                        </span>
                        <p className="text-xs md:text-sm break-words">
                          {allocation.schoolName}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 block">
                          Centre Name
                        </span>
                        <p className="text-xs md:text-sm break-words">
                          {allocation.centreName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
