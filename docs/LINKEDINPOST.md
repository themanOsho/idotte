LinkedIn Post Draft
Challenges & Solutions – Building a Reliable School Admission Matching Engine
Working on a Lagos State junior-secondary admission verification system taught me that “just normalize the strings” is rarely enough when real data is messy.
Challenge 1 – Missing / N/A School-of-Choice data in Redirected reports
Redirected students (placed in a different school) often showed “N/A, N/A” under School of Choice, while Admitted cases resolved cleanly.
Root cause: the report was using the client’s raw string and an incomplete LGA lookup that only worked for exact directory hits.
Solution: every school name (choice or actual) is now resolved against the master Datastream first, then the official school directory. The clean Datastream name + its true LGA are always displayed. Never the raw client text.
Challenge 2 – Inconsistent naming conventions
The same school appeared as “XYZ KUTI” in the client list and “XYZ KUTI MEM. SEC.” in the Datastream. Admitted rows showed the clean name; Redirected rows did not.
Solution: a single resolve path that returns only official names. Abbreviations are handled only after exact matching fails, using the same token logic already trusted by the “direct admission” classifier.
Challenge 3 – False-positive mapping (the classic trap)
Input: “XYZ ADUGBO JNR HIGH”
Datastream contained both “XYZ ADUGBO JNR HIGH” (Ifako) and “XYZ ADUGBO SEC. SCH” (Kosofe).
Aggressive normalization stripped “JNR / HIGH / SEC / SCH”, making both strings identical → wrong school + wrong LGA.
Solution: strict two-step priority

Exact 1:1 match (light clean-up only – no token stripping). If found → return immediately.
Only when zero exact hits → run full normalization + token scoring.

This hierarchy eliminated the false positives while still recovering legitimate abbreviations.
Why this is the best approach for this domain

Exact match first respects the official source of truth (the Datastream).
Fuzzy matching is a deliberate fallback, never the default.
Every visual field in the report is guaranteed to show a clean, authoritative school name + LGA.
Existing classification rules (Admitted vs Redirected) and student-name matching were left completely untouched – zero regression risk.

Clean data pipelines are rarely glamorous, but when thousands of students’ placements depend on them, the discipline of “exact first, fuzzy only when necessary” pays off every time.