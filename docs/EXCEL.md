Perfect. This is where Idotte starts delivering its core value.

One thing I'd change from the earlier proposal: **don't generate Excel directly from the UI**. Treat Excel export as its own engine, just like parsing and matching.

## Final architecture

```
src/
├── engine/
│   └── export/
│       └── excel/
│           ├── workbook.ts
│           ├── styles.ts
│           ├── summary-sheet.ts
│           ├── matched-sheet.ts
│           ├── duplicate-sheet.ts
│           └── unmatched-sheet.ts
│
├── services/
│   └── export-service.ts
│
└── components/
    └── report/
        └── export-excel-button.tsx
```

---

# Step 1 — Create the workbook

```
src/engine/export/excel/workbook.ts
```

This file should **only orchestrate** the workbook.

```ts
import ExcelJS from "exceljs";

import { buildSummarySheet } from "./summary-sheet";
import { buildMatchedSheet } from "./matched-sheet";
import { buildDuplicateSheet } from "./duplicate-sheet";
import { buildUnmatchedSheet } from "./unmatched-sheet";

import type { WorkbookPreview } from "@/types/preview";
import type { ClientWorkbookSummary } from "@/types/client";
import type { MatchingResult } from "@/types/matching";

export async function buildPlacementWorkbook(
  allocation: WorkbookPreview,
  client: ClientWorkbookSummary,
  result: MatchingResult
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Idotte";
  workbook.company = "Mrs Olujobi";
  workbook.subject = "Primary Six Placement Report";
  workbook.title = "Placement Report";

  buildSummarySheet(
    workbook,
    allocation,
    client,
    result
  );

  buildMatchedSheet(
    workbook,
    result.matched
  );

  buildDuplicateSheet(
    workbook,
    result.duplicateMatches
  );

  buildUnmatchedSheet(
    workbook,
    result.unmatched
  );

  return workbook;
}
```

Notice how clean this is.

---

# Step 2 — Shared styling

```
styles.ts
```

Instead of styling every sheet individually.

```ts
export function styleHeaderRow(...)
```

```ts
export function styleTitle(...)
```

```ts
export function styleBorders(...)
```

Every sheet imports them.

---

# Step 3 — Summary Sheet

Exactly like the printed cover.

```
Placement Report

Allocation Workbook

Client Workbook

Generated

--------------------------------

Matched

Duplicates

Unmatched

Match Rate
```

Very clean.

---

# Step 4 — Matched Sheet

```
S/N

Candidate ID

Candidate Name

Feeder School

Examination Centre
```

No colours except header.

Freeze first row.

Auto filter.

Landscape **off**.

Portrait.

---

# Step 5 — Duplicate Sheet

Same layout.

Each possible allocation occupies one row.

Exactly like your HTML DuplicateTable.

---

# Step 6 — Unmatched Sheet

```
S/N

Candidate Name

Status
```

Status:

```
No allocation found
```

---

# Step 7 — Download Service

```
services/export-service.ts
```

This keeps downloading separate from workbook generation.

```ts
buildWorkbook()

↓

writeBuffer()

↓

download()
```

Your UI never sees ExcelJS.

---

# Step 8 — Export Button

```
Export Excel
```

Click.

```
Placement Report.xlsx
```

downloads.

---

## Why I like this

Notice something?

Every output format now uses exactly the same source.

```
Matching Result
        │
        ├── HTML Report
        ├── Print
        ├── Excel
        └── PDF (later)
```

No duplicated business logic.

---

# One improvement I'd make

I'd rename the workbook from:

```
Placement Report.xlsx
```

to something users can identify immediately.

Example:

```
Primary Six Placement Report - Agege.xlsx
```

or, if you have the workbook name:

```
Primary Six Placement Report - Agege Client List.xlsx
```

When someone has 30 reports in a folder, descriptive filenames save a lot of time.

---

## I suggest we build it in this order

1. ✅ `workbook.ts` (orchestrator)
2. ✅ `styles.ts`
3. ✅ `summary-sheet.ts`
4. ✅ `matched-sheet.ts`
5. ✅ `duplicate-sheet.ts`
6. ✅ `unmatched-sheet.ts`
7. ✅ `export-service.ts`
8. ✅ `ExportExcelButton`

This gives you a working export pipeline quickly, with each sheet being added independently and tested as you go.
