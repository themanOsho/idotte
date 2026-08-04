# Changelog

## [Unreleased]

Where we are now

Here's the current state of Idotte:

git commit -m "feat(admission-matching): implement sophisticated fuzzy school-name matching"

BREAKING CHANGE: School matching now uses word-by-word fuzzy comparison instead of exact string equality.

## Features
- **Word-by-Word Fuzzy Matching**: Scan school names left to right with geographic name prioritization
- **Abbreviation Expansion**: COMM/COMMUNITY, JNR/JUNIOR, GRAMM/GRAM/GRAMMAR, SEC/SECONDARY, PRY/PRIMARY, COMP/COMPREHENSIVE, HGH/HIGH, EST/ESTATE, SNR/SENIOR, SCH/SCHOOL, COL/COLL/COLLEGE, GOVT/GOVERNMENT
- **60% Threshold Rule**: Schools with 4-5 words matching 3+ words = Direct Admission
- **Fuzzy LGA Resolution**: Find school in directory using fuzzy matching, not exact match
- **Enhanced Report Output**: Not Admitted now shows matched school name and resolved LGA (no more N/A)

## Implementation Details
- normalize-school-name.ts: Enhanced with getSchoolNameTokens(), calculateSchoolNameSimilarity(), isDirectAdmission()
- classification.ts: Added SchoolResolution interface, fuzzy fallback in LGA resolution, matchedSchoolName field
- map-client.ts: Updated Not Admitted section to display matched school names and LGAs

## Test Cases Verified
✓ "COMMUNITY JUNIOR GRAMMAR SCHOOL IPAJA" → "COMM. JNR GRAM, IPAJA" = Direct
✓ "AJAO ESTATE JUNIOR GRAMMAR SCHOOL" → "AJAO ESTATE SEC. SCH" = Direct
✓ "OJUWOYE JUNIOR COMPREHENSIVE HIGH SCHOOL MUSHIN" → "OJUWOYE COMP. JUNIOR HIGH" = Direct