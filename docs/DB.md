I actually changed my mind on two things after your last message.

---

# 1. Admission Detection

If **the headings cannot be relied on**, then I'd completely remove heading detection from the parser.

Instead, I'd make the parser **style-aware**.

You already observed something very valuable:

> **The only reliable difference is the table background.**

For example:

```text
Admitted
---------
White Fill

Not Admitted
------------
Gray Fill
```

ExcelJS exposes cell formatting, including fills.

The parser can inspect the fill color of the first cell (or a representative cell) in each candidate row.

Pseudo logic:

```ts
if (row.getCell(1).fill === GRAY) {
    status = "Not Admitted";
} else {
    status = "Admitted";
}
```

But I wouldn't hardcode "gray".

I'd create a detector.

```text
Row

↓

Detect Fill

↓

Map Fill → Status
```

Meaning later, if SUBEB changes the gray shade, you only update one detector.

Even better...

During the **first admission import**, Idotte can show:

> "Detected two table styles."

```
Style A

██████

123,401 rows

↓

Admitted

Style B

██████

18,233 rows

↓

Not Admitted
```

If the colors ever change in a future year, your aunt can confirm them once instead of you changing code.

That makes the parser much more future-proof.

---

# 2. Home Page

You're right.

I don't think there should be a separate Import page anymore.

The **Home page is the Import Center**.

Everything begins there.

I'd structure it like this:

```text
Dashboard

────────────────────────

Allocation Dataset

Ready

Replace Dataset

────────────────────────

Admission Dataset

Not Imported

Import

────────────────────────

Upload Client List

Generate Placement Report

Generate Admission Report

────────────────────────

Recent Reports
```

Everything happens from one screen.

No unnecessary navigation.

---

# Final Product Roadmap

This is how I now see Idotte evolving.

---

# Phase 1 — Placement Engine ✅

Current MVP.

## Allocation

* Upload Allocation Workbook
* Parse
* Normalize
* Match Client List

## Client

* Upload Client Workbook

## Reports

* Preview
* Print
* Excel Export

Already ~90% complete.

---

# Phase 1.1 — Polish (Finish before Neon)

I would only polish what affects today's workflow.

## UI

* Better upload progress
* Validation messages
* Better empty states
* Mobile polish
* Print optimization
* Watermark improvements

## Reports

* Final typography
* Consistent spacing
* Report footer
* Better duplicate presentation

## Performance

* Large workbook optimization
* Better matching speed
* Error recovery

Then stop.

Don't add features.

---

# Phase 2 — Persistent Datasets

Introduce:

* Neon PostgreSQL
* Drizzle ORM

No UI overhaul.

Only backend changes.

---

## Workspace

```
Workspace

olujobi-subeb

Secret Key
```

Every dataset belongs to a workspace.

---

## Allocation Dataset

Replace

↓

Deletes previous dataset

↓

Imports new dataset

↓

Ready

```

No manual delete.

---

## Admission Dataset

Exactly the same.

```

Replace

↓

Delete

↓

Import

↓

Ready

```

---

## School Directory

Generated automatically.

No uploads.

No manual mapping.

---

# Phase 3 — Admission Engine

This is where the intelligence starts.

Instead of:

```

Header Parser

```

Build:

```

Workbook Parser

↓

Sheet Parser

↓

Row Style Detector

↓

Candidate Detector

↓

Database

```

It understands the workbook.

Not just reads it.

---

## Admission Verification

Client upload.

↓

School Choice

↓

School Directory

↓

Admission Records

↓

Admission Number

↓

Report

---

# Phase 4 — Workspace Experience

Home page becomes:

```

Workspace

──────────────

Allocation Dataset

Ready

Admission Dataset

Ready

──────────────

Upload Client List

──────────────

Placement Report

Admission Report

──────────────

Recent Reports

```

Simple.

Office friendly.

---

# Phase 5 — Client List Management

Only after admission season.

```

Client Lists

New

Edit

Import

Archive

Search

Duplicate

History

```

---

# Phase 6 — OCR

Future.

```

Camera

↓

Handwritten List

↓

OCR

↓

Client List

↓

Placement

```

---

# Architecture

```

Home Dashboard
│
▼
Workspace
│
┌──────┴────────┐
│               │
▼               ▼
Allocation     Admission
Dataset         Dataset
│               │
└──────┬────────┘
▼
School Directory
│
▼
Upload Client
│
┌──────┴─────────┐
▼                ▼
Placement     Admission
Report         Report

```

---

## One thing I'd add before we touch the database

I would create a file called:

```

docs/
IDOTTE_ARCHITECTURE.md

```

Not because we need documentation.

Because **the project has become large enough that it now has a real architecture**.

It should define:

- Folder structure
- Data flow
- Workspace model
- Dataset lifecycle
- Report engine
- Matching engine
- Admission engine
- Database schema
- Future roadmap

I genuinely think this will save you a lot of time six months from now. Right now, most of the design lives in our conversations. Converting it into a living architecture document will make future development—and future contributors if you ever have them—much easier.
```