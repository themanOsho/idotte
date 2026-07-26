# Changelog

## [Unreleased]

### What we've completed

At this point, we've completed a solid foundation for **Milestone 1: Allocation Upload & Parsing**. The app has evolved from a landing page into the first working version of Idotte's processing engine.

#### 🎨 Foundation & UI

* Set up the Idotte landing page with a premium dark UI inspired by Linear/Vercel.
* Introduced the Lagos State-inspired emerald brand palette.
* Added responsive layout utilities and reusable design classes.
* Enabled dark mode throughout the application.

#### 📤 Allocation Upload

* Built the `AllocationUpload` component.
* Users can upload an allocation Excel workbook.
* File selection is displayed immediately after upload.

#### 📖 Allocation Parser

* Implemented `parseAllocationWorkbook()`.
* Supports Excel workbooks with one or more worksheets.
* Dynamically discovers required columns using header names instead of hard-coded column indexes.
* Validates required headers before processing.
* Parses every candidate into the internal `AllocationRecord` model.
* Produces an `AllocationWorkbookSummary`.

#### ⚙️ Allocation Index Engine

* Built a fast in-memory lookup index.
* Candidate names are normalized before indexing.
* Supports duplicate candidate names by storing multiple records per key.
* Added progress callback support for future UI updates.

#### 📊 Workbook Analytics

The parser and indexer now generate meaningful statistics:

* Total Records
* Worksheets
* Unique Candidates
* Duplicate Records
* Names With Duplicates

Duplicate statistics were corrected to reflect true duplicate rows instead of over-counting repeated names.

#### 📈 Workbook Preview

Replaced the original text summary with a dashboard-style preview.

Features include:

* Workbook information
* Responsive statistics cards
* Worksheet summary table
* Thousands separators using `toLocaleString()`
* Mobile-friendly responsive layout

#### 🔄 Upload Progress

Introduced upload progress stages:

* Reading workbook
* Parsing workbook
* Building index
* Complete
* Error handling

The parser and indexer now expose progress callbacks, laying the groundwork for richer progress reporting.

#### 🧱 Architecture Improvements

* Introduced `ALLOCATION_HEADERS` constants to avoid string literals.
* Separated responsibilities between parsing and indexing.
* Added dedicated TypeScript types for allocation parsing, workbook previews, upload stages, and indexing.

---

## Current project status

✅ Landing Page

✅ Allocation Upload

✅ Excel Parsing Engine

✅ Workbook Validation

✅ Allocation Index

✅ Workbook Analytics

✅ Responsive Workbook Dashboard

🟡 Client Upload (Next)

⬜ OCR Engine

⬜ Matching Engine

⬜ Report Generator

⬜ PDF Export

---