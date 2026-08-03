I agree with hiding the Allocation upload card once it's been successfully processed.

That creates a much cleaner, guided workflow.

The page should become:

```text
Upload Allocation
        │
        ▼
Workbook Summary
        │
        ▼
Upload Client List
        │
        ▼
Client Summary
        │
        ▼
Run Matching
        │
        ▼
Matching Dashboard
```

Instead of leaving the Allocation upload visible forever.

---

# Verification of our current implementation

Here's an honest status check against your roadmap.

| Feature                                         | Status                             | Notes                                                                     |
| ----------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| ✅ Uploading a client Excel file                 | **Implemented (engine & service)** | Parser/service exist, but **UI upload card is not yet built**.            |
| Uploading scanned/PDF client lists              | ❌ Not implemented                  | No PDF parser yet.                                                        |
| OCR extraction for scanned documents            | ❌ Not implemented                  | No OCR engine yet (Tesseract/Azure Vision/etc.).                          |
| Manual field mapping (when column names differ) | ❌ Not implemented                  | Current parser expects known headers.                                     |
| Client workbook preview                         | ⚠️ Partially                       | Types/services exist, but there is **no preview component/UI**.           |
| Client indexing engine                          | ❌ Not implemented                  | Currently unnecessary because matching is driven by the Allocation index. |

---

## One correction I'd make to the roadmap

This item:

> Client indexing engine

I actually **wouldn't build**.

Reason:

Allocation uses an index because we're searching it thousands of times.

```
38,000 allocation records

↓

index

↓

O(1) lookup
```

That's exactly what a `Map` is for.

---

The client list is different.

Suppose:

```
800 clients
```

We simply iterate once:

```ts
for (const client of clients) {

    allocationIndex.get(...);

}
```

The client list is never searched repeatedly.

So an index would consume memory without providing a real performance benefit.

I'd remove that milestone entirely.

---

# What I recommend building next

## Phase 1 (UI)

* Hide Allocation Upload after success.
* Build **Client Upload Card**.
* Build **Client Workbook Summary** (same premium design as Allocation).
* Show **Run Matching** button.

---

## Phase 2

When **Run Matching** completes:

```
Matched
Ambiguous
Unmatched
Match Rate
```

Display the dashboard immediately.

---

## Phase 3

Only after all of that would I begin:

* PDF upload
* OCR
* Manual column mapping
* Fuzzy matching

Those are advanced capabilities. The core Excel workflow should feel complete and polished first.

I think this order gives Idotte the strongest MVP while keeping the architecture we've built clean and extensible.


Phase 1 (next)

✅ Matching Results Dashboard
✅ Matched Table
✅ Unmatched Table
✅ Duplicate Resolution

Phase 2

📄 Generate Placement Report
📥 Export to Excel
📥 Export to PDF

Phase 3

🤖 Fuzzy Matching
🤖 OCR
🤖 Duplicate Intelligence
🤖 Smart Suggestions


We'll build the Duplicate Resolution Workspace itself:

A card for each duplicate candidate.
Radio-button selection between matching allocation records.
"Save Selection" to convert it into a MatchedRecord.
Live progress (e.g. "12 of 17 resolved").
Automatic update of the Matching Results Dashboard as duplicates are resolved.

That's the point where Idotte starts guiding users through the real placement process rather than just displaying data.

-- moving on please minimize the use of extra lines in the code Instead of using extra line after every line of code instead use it after code block/functions/sections


then:
Duplicate Review UI,


What I'd implement first

Before anything else, I'd make these four improvements:

Flexible header matching (case-insensitive, trims whitespace, normalises spacing, and supports common aliases like Name, NAME, Candidate ID, CandidateID).
Friendly UI error handling (display import failures in the interface instead of leaving them in the console).
Progress updates per worksheet/stage (so users see steady movement rather than 10% → 100%).
Aggregated validation (report all worksheet issues in one message instead of failing on the first error).

Those changes won't add any new features, but they'll make Idotte feel significantly more reliable and professional for your aunt's day-to-day use.



# Today

To make absolutely sure we map to the correct "John Doe", we must perform Multi-Attribute Context Matching.

Since we can control the client workbook, we have two different ways to handle this depending on what fields are present on the incoming list.
------------------------------
## Strategy 1: The Absolute Best Way (Admission Number Matching)
The most bulletproof way to separate two people with the same name is to use their unique Admission Number. If you can include an Admission No. column in your client list, the lookup becomes 100% deterministic and cannot make a mistake.
We change the key lookup from Name to Admission Number. It matches directly with zero ambiguity:

// If the client list provides an admission number, we check that column firstif (clientAdmissionNumber) {
  // Loop through all records under the name "JOHN DOE"
  const exactMatch = matchedRecords.find(record => record.admissionNumber === clientAdmissionNumber);
  if (exactMatch) return exactMatch;
}

------------------------------
## Strategy 2: The Contextual Way (School of Choice Alignment)
If your client lists only provide the Name and School of Choice, we use the intended school as a validation anchor.
If your client list row says:

* Name: JOHN DOE
* School of Choice: EWUTUNTUN JNR

The engine pulls down both records from your JSON file and performs a process of elimination:

   1. It looks at the first record: schoolName: "EWUTUNTUN JNR GRAMM SCH". It matches!
   2. It looks at the second record: schoolName: "SURULERE JNR SEC.". It does not match.

The engine instantly discards the Surulere record and locks onto the Ewutuntun entry, marking him as ADMITTED_AS_EXPECTED.
------------------------------
## Strategy 3: The Redirection Guard
What if both John Does were redirected to completely different schools than what they originally wanted? For example:

* Client List says: JOHN DOE wants AGEGE JNR HIGH.
* JSON Record 1: Admitted to EWUTUNTUN JNR (Oshodi)
* JSON Record 2: Admitted to SURULERE JNR (Alimosho)

If both are redirections, the engine cannot guess who is who based on school names. To prevent a false match, the engine flags this row clearly in the data matrix output:

result.isAdmitted = true;
result.isAmbiguousDuplicate = true; // Flaged for manual double-check
result.possibleMatchesCount = matchedRecords.length;

This tells your aunt: "We found two students named John Doe who gained admission elsewhere, so please manually check their physical slips to confirm their exact center placement."
------------------------------
## Summary Checklist for your 2026 Worksheets
To make your 2026 data stream completely foolproof against name duplicates across Lagos State, choose one of these adjustments:

* Easiest Fix: Add an Admission No. or Registration No. column to your incoming Client List.
* No-Change Alternative: Keep using the School of Choice column, and let the matcher code automatically filter duplicates by tracking keyword text overlaps.

If you want to add the Ambiguity Duplicate Flag to your dashboard UI so it highlights duplicates in a distinct color, let me know!
