# Stage 1.2 — Admission Mapping (Priority Release)

## Objective

Ship a production-ready Admission Mapping workflow before the official admission lists are released.

Current Allocation matching remains unchanged and continues to operate entirely in memory.

No database work will be done for Allocation during this stage.

---

# Current State

## Placement Workflow

Allocation Workbook

↓

Memory

↓

Client Workbook

↓

Placement Report

This remains unchanged.

---

# New Workflow

Admission Workbook

↓

PostgreSQL

↓

Client Workbook

↓

Admission Report

---

# Why This Order?

Allocation matching has already completed its purpose for the current academic session.

Admission processing begins shortly and represents the next real operational need.

Building Admission first provides immediate value while laying the architectural foundation for future Allocation database support.

---

# Phase 1
## Database Foundation

- Neon PostgreSQL
- Drizzle ORM
- Migration setup

Deliverable

✓ Database connected

---

# Phase 2
## Admission Schema

Create tables

Admission Candidates

```
id

admissionNumber

candidateName

normalizedName

schoolName

area

lga

status

sourceWorkbook

sourceSheet

createdAt
```

Indexes

```
normalizedName

schoolName

lga

area
```

Deliverable

✓ Admission database ready

---

# Phase 3
## Hidden Admin

```
/admin
```

Contains

Admission Dataset

Future Allocation Dataset

System Status

---

# Phase 4
## Admission Import Engine

Responsibilities

- Read workbook
- Read every worksheet
- Locate table automatically
- Ignore workbook titles
- Ignore blank rows
- Ignore notes
- Detect admitted section
- Detect non-admitted section
- Normalize rows
- Save into PostgreSQL

Deliverable

✓ Reliable Admission importer

---

# Phase 5
## Dataset Replacement

Every upload performs

Replace

not

Append

Workflow

Upload

↓

Validate

↓

Delete previous dataset

↓

Insert new dataset

↓

Success

Deliverable

✓ One authoritative dataset

---

# Phase 6
## Client Admission Matching

Upload Client Workbook

↓

Read School of Choice

↓

Determine Area

↓

Query Admission database

↓

Find Candidate

↓

Return

Admission Status

Admission Number

School

Area

LGA

Deliverable

✓ Admission Matching Engine

---

# Phase 7
## Admission Report

Report includes

Candidate Name

Admission Status

Admission Number

School

Area

LGA

Remarks

Export

- Print
- Excel

Deliverable

✓ Production-ready Admission Report

---

# Future

After Admission season ends

Implement

Allocation Database

using exactly the same architecture

Admin Upload

↓

Validate

↓

Replace

↓

Lookup

↓

Report

Almost all infrastructure built for Admission can be reused.

---

# Out of Scope

- Allocation Database
- Client List Management
- Authentication
- Multiple Workspaces
- Dataset Versioning