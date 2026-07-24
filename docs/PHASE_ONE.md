Phase 1 Roadmap (MVP)

Now comes the important part.

Remember our mission:

Help your aunt generate placement reports for each client in minutes.

Nothing else matters until this works.

🎯 Phase 1 Goal

Upload Allocation List + Upload Client List → Generate Report PDF

If we achieve that, we've solved the real-world problem.

Milestone 1 — Foundation ✅

Status: In Progress

 Initialize project
 Configure TypeScript
 Configure Tailwind + shadcn/ui
 Configure Dark Mode
 Create design system
 Create documentation
 Build landing page
 Project branding
 Logo
Milestone 2 — Allocation Engine

This becomes the application's backbone.

Features
Upload Excel workbook
Read workbook
Detect worksheet
Detect headers
Manual column mapping
Normalize records
Build in-memory index
Display candidate count
Display allocation summary

Output:

AllocationRecord[]
Milestone 3 — Client Parser

Support both workflows.

Excel

Upload

↓

Read workbook

↓

Extract candidate names

PDF

Upload scanned PDF

↓

OCR

↓

Extract rows

↓

Identify Name column

↓

Normalize

Output

ClientCandidate[]
Milestone 4 — Matching Engine

Pipeline

Normalize

↓

Exact Match

↓

Case-insensitive

↓

Whitespace normalization

↓

Nickname support (future)

↓

Review Queue

Each match gets a confidence score.

100%

95%

80%

0%
Milestone 5 — Report Generator

Generate

S/N

Full Name

Sex

Date of Birth

School Name

Centre Name

Automatically

Alphabetical order
Page numbers
Report title
Generation date
Client name (optional)
Total matches
Total unmatched

Output

report.pdf
Milestone 6 — Review Screen

If something isn't matched.

Display

Client Name	Suggested Match	Confidence

Officer chooses.

Continue.

Milestone 7 — Processing History

Store

Client

Date

Candidates

Matched

PDF

So reports can be downloaded again.

🎯 Definition of Done (Phase 1)

A staff member should be able to:

Open Idotte.
Upload Allocation Excel.
Upload a client Excel or scanned PDF.
Click Generate Report.
Download a PDF sorted alphabetically with each candidate's:
Full Name
Sex
Date of Birth
School Name
Centre Name

Target processing time: under 2 minutes for 300–500 candidates.

What We're Not Building Yet

To stay focused, we'll intentionally defer:

User authentication
Dashboards
Multi-user roles
Database persistence
Parent search portal
Analytics
Notifications
Cloud storage
Public APIs

Those belong in Phase 2 and beyond.

🚀 Our Next Coding Milestone

The very next feature we implement should be Allocation Upload.

Not because it's exciting, but because every other feature depends on it.

We'll build it as a reusable engine:

Upload Excel
        │
        ▼
 Parse Workbook
        │
        ▼
Detect Headers
        │
        ▼
Column Mapping
        │
        ▼
Normalize Records
        │
        ▼
Allocation Index
        │
        ▼
Ready ✔