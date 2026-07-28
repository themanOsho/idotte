This is the order I'd build them in:

## Phase 1 — Print Stylesheet ⭐⭐⭐⭐⭐ (Next)

This gives you immediate value because your report components already exist.

```
ReportCover
MatchedTable
DuplicateTable
UnmatchedTable
```

become a professional A4 report with:

* A4 portrait
* margins
* repeating table headers
* page breaks
* no buttons/UI
* black text
* print-friendly colours

At that point users can simply:

```
Ctrl + P
↓
Save as PDF
```

without any extra code.

---

## Phase 2 — PDF Export ⭐⭐⭐⭐⭐

Once print styles exist, PDF export becomes almost free.

```
Generate Report
      ↓
window.print()
      ↓
Save as PDF
```

Later you can replace it with a proper PDF generator if needed.

The important thing is the printed document already looks perfect.

---

## Phase 3 — Excel Export ⭐⭐⭐⭐☆

This is where Idotte becomes genuinely useful.

You'll generate something like:

```
Placement Report.xlsx

├── Cover
├── Matched Candidates
├── Duplicate Candidates
└── Unmatched Candidates
```

using ExcelJS.

Each sheet will already have

* borders
* bold headers
* frozen header row
* auto column widths
* print area
* page setup

instead of dumping raw JSON.

This is what SUBEB staff will probably keep as their master copy.

---

# Eventually...

```
Upload Dataset
      ↓
Upload Client
      ↓
Run Matching
      ↓
──────────────
Report Viewer
──────────────

✓ Cover
✓ Matched
✓ Duplicates
✓ Unmatched

[ Print ]
[ Export PDF ]
[ Export Excel ]
```

That's a complete workflow.

---

## My recommendation

I'd build them in this exact order:

1. ✅ Print stylesheet
2. ✅ Print Preview page
3. ✅ Excel Export (ExcelJS)
4. ✅ PDF Export

Notice I swapped Excel and PDF.

Why?

Because you're **already using ExcelJS**, and Idotte's users are dealing with Excel workbooks every day. A well-formatted `.xlsx` export is likely to be more valuable operationally than a PDF. PDF can largely piggyback on the polished print layout, while the Excel export becomes a first-class deliverable that users can archive, inspect, or edit if needed.

At that point, Idotte will have evolved from a matching tool into a complete **placement report generation system**, which feels like the right milestone before adding more advanced features such as fuzzy matching improvements or duplicate resolution.
