# Changelog

## [Unreleased]

feat: implement client upload workflow and matching services

- Introduced application service layer
  - allocation-service
  - client-service
  - matching-service
  - report-service

- Refactored allocation upload into service-based workflow

- Implemented client workbook parsing service

- Added workbook and client summaries to workspace state

- Introduced matching engine service integration

- Added report generation service

- Refactored matching engine to return all allocation records for duplicate names

- Added duplicate match tracking to MatchingResult

- Added duplicate resolution state and actions to WorkspaceProvider

- Implemented workspace overview after successful uploads

- Replaced allocation preview workflow with upload progression

- Added reusable FileUploadCard component

- Unified allocation and client upload UI

- Added premium workbook statistics dashboard
  - Total Records
  - Unique Candidates
  - Duplicate Records
  - Names With Duplicates

- Improved upload progress modal
  - auto-dismiss
  - simplified UI
  - progress-driven workflow

- Introduced matching results dashboard foundation

- Added duplicate resolution components

- Refactored project toward service-oriented architecture

Current Progress

At this point, Idotte has a solid architecture:

✅ Allocation Upload
✅ Allocation Parser
✅ Allocation Index
✅ Client Upload
✅ Client Parser
✅ Matching Engine
✅ Matching Service
✅ Report Service
✅ Workspace Provider
✅ Upload Workflow
✅ Matching Results Dashboard
✅ Duplicate Resolution foundation
✅ Service Layer
✅ Workspace Overview


refactor: separate parsing, matching and workspace pipeline

- Introduced ParsedAllocationWorkbook to separate parsing from business logic
- Refactored allocation parser to return raw parsed workbook only
- Moved workbook enrichment into allocation-service
- Centralized duplicate statistics generation in the service layer
- Refactored matching engine to distinguish:
  - matched records
  - duplicate matches
  - unmatched records
- Added DuplicateMatch model to support manual duplicate resolution
- Updated MatchingResult with:
  - duplicateMatches
  - duplicateCount
  - matchRate
- Refactored report generation to use duplicate match statistics
- Improved separation of responsibilities across parser, indexer and services
- Continued aligning the architecture for the Duplicate Resolution workflow