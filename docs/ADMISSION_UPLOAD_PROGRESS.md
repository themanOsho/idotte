# Phase 2 — Admission Upload Progress

## Goal

Implement a dedicated upload/progress pipeline for Admission Mapping.

This should **not reuse** the existing Placement upload services. Instead, everything related to Admission Mapping should live inside the `src/admission/` directory.

The UI should behave exactly like the existing Placement upload experience so the application feels consistent.

---

# Reference Implementation

Use these existing files only as implementation references.

```
src/services/client-service.ts

src/context/workspace-provider.tsx

src/components/shared/upload-progress-modal.tsx

src/types/upload.ts
```

Do **not** import business logic from these files.

Simply mimic their flow and user experience.

---

# New Admission Structure

Create a dedicated service layer inside:

```
src/admission/
```

Example structure

```
admission/

├── services/
│   ├── admission-service.ts
│   └── admission-progress.ts
│
├── types/
│   ├── admission-upload-stage.ts
│   └── admission-upload-progress.ts
│
├── engine/
│   ├── matcher.ts
│   ├── resolver.ts
│   ├── search-preferred.ts
│   └── search-global.ts
```

No admission upload logic should live outside this folder.

---

# Upload Flow

The landing page uploads only the Client List.

Immediately after upload begins,

call

```
processAdmissionMatching(...)
```

inside

```
admission/services/admission-service.ts
```

The service is responsible for reporting progress.

---

# Upload Stages

Use dedicated Admission stages.

```
idle

reading

resolving

preferred-search

global-search

building-report

complete

error
```

These stages are independent from Placement.

---

# Progress Behaviour

Progress should feel natural.

Never jump

```
10%

↓

100%
```

Instead progress continuously.

Example

```
Reading Client Workbook
5%

12%

18%

24%
```

↓

```
Resolving Intended Schools
31%

36%

42%
```

↓

```
Searching Preferred Schools
50%

55%

63%
```

↓

```
Searching Other Schools
72%

79%

84%
```

↓

```
Building Admission Report
91%

95%

98%
```

↓

```
Completed
100%
```

The progress bar should animate smoothly exactly like the Placement modal.

---

# Progress Messages

Display friendly messages.

Examples

```
Reading client workbook...

Resolving school locations...

Searching intended schools...

Searching other schools...

Preparing report...

Admission report generated.
```

---

# Progress Calculation

Progress should represent actual work.

Reading workbook

≈10%

Resolving schools

≈20%

Searching preferred schools

≈40%

Global search

≈20%

Building report

≈10%

Completion

100%

Within loops, continuously emit updated progress so the bar advances gradually.

---

# UI

Reuse the existing

```
UploadProgressModal
```

component.

Do not create another modal.

Only feed it Admission progress values.

This keeps the UI visually identical while allowing the Admission logic to remain completely self-contained.

---

# Error Handling

Errors should behave exactly like Placement.

Display

```
ErrorModal
```

with friendly messages.

Examples

```
Client workbook could not be processed.
```

```
School directory could not be resolved.
```

```
Admission dataset is missing.
```

```
Admission report generation failed.
```

No console-only failures.

---

# Design Principle

The Admission module should be self-contained.

The landing page only does:

```
Upload Client Workbook

↓

processAdmissionMatching(file)
```

Everything else—including parsing, progress updates, matching, report generation, and errors—is handled internally inside

```
src/admission/
```

This keeps the Admission engine modular, reusable, and independent from the existing Placement implementation while maintaining a consistent user experience.
