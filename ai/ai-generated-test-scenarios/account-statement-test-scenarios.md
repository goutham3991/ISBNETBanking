# Transactions - Account Statement Test Plan and Scenarios

## Application Overview

# Account Statement - Test Plan and Scenarios

## Application Overview
The authenticated banking app's Transactions page is `/banking/transactions`, titled Account Statement. It shows the account context and a statement table with Date, Description, Reference, Type, Amount, Balance, and Status columns. Above it are Date From and Date To date inputs, Type options All/Credit/Debit, Status options All/Success/Pending/Failed, a Search field with placeholder `Description or Ref No.`, Apply Filters, and Clear. Below are result count, Prev/page-number/Next pagination controls, and Download Statement actions for PDF, CSV, and XLS.

Filters are staged: changing a date/select/search value alone does not update rows; Apply Filters executes them. A known exact reference search returned its matching row. Lowercase partial description search (`priya`) returned the `Priya Sharma` transaction, confirming case-insensitive partial search for that sample. A same-day date range returned a transaction on that date. An inverted date range (From later than To) was accepted by native input validity and rendered `No transactions found matching your filters.` with `Showing 0-0 of 0 transactions`. Clear emptied both dates and search, reset Type/Status to All, and restored the five original records.

Observed no-match text: `No transactions found matching your filters.` Filtered Debit results showed inconsistent Balance values compared with the unfiltered records: the row balances changed after applying the filter. Treat this as a candidate application defect. Do not expect filtered results to rewrite historical running balances; verify against the same references in the unfiltered ledger.

Exploration used existing statement records and did not create, edit, or delete a transaction. Only one page of five transactions was present, so pagination behavior beyond the disabled Prev/Next state was not exercised. Export buttons were visible but not activated.

## Preconditions
- Authenticate using the existing test setup; no credentials belong in scenarios or logs.
- Use the stable demo account statement dataset; capture original filter values, row count, and table rows before each isolated case.
- No transaction mutation is needed for filter/search scenarios.
- When validating date boundaries, use dates present in the test data or controlled seeded records; do not assert that absent dates must return a specific record.
- Pagination tests require enough statement rows to produce multiple pages; use controlled seeded data rather than adding transactions during a read-only statement test.
- Export tests should use an isolated download destination and verify file type/content without changing statement data.

## Test Data
- Existing observed references: `TXN001` through `TXN005`; references are test data and may change after reseeding.
- Existing descriptions include NEFT rent debit, salary credit, IMPS debit, UPI credit, and electricity-bill debit. Use row values dynamically when practical.
- Date sample values observed: `2026-04-12`, `2026-04-15`, `2026-04-18`, `2026-04-20`, and `2026-04-22` in the date inputs' ISO format.
- Type values: `all`, `credit`, `debit`.
- Status values: `all`, `Success`, `Pending`, `Failed`.
- Search samples: exact reference, partial description in mixed/lowercase, unmatched string, blank/whitespace, and special characters.
- Export actions: PDF, CSV, XLS. File format details are Needs Verification.

## Test Scenarios

| ID | Scenario | Type | Priority | Preconditions | Test Data | Expected Result |
|----|----------|------|----------|---------------|-----------|-----------------|
| AS-001 | Open Account Statement and verify default table | Positive | P0 | Authenticated, seeded statement data exists | Default filters | Account Statement/context, seven headers, default rows and result summary are visible |
| AS-002 | Apply Debit filter | Positive | P1 | At least one debit and one credit exist | Type=Debit | Only debit rows remain; Apply Filters is required |
| AS-003 | Apply Credit filter | Positive | P1 | At least one credit and one debit exist | Type=Credit | Only credit rows remain; positive amounts and Credit type agree |
| AS-004 | Apply Success status filter | Positive | P1 | Successful transactions exist | Status=Success | Only Success rows remain |
| AS-005 | Apply Pending status filter | Positive / Needs Verification | P2 | Pending record exists, or verify empty result on seeded dataset | Status=Pending | Matching Pending rows only; if none exist, observed no-match state and 0-0 summary |
| AS-006 | Apply Failed status filter | Positive / Needs Verification | P2 | Failed record exists, or verify empty result on seeded dataset | Status=Failed | Matching Failed rows only; if none exist, observed no-match state |
| AS-007 | Compose Type and Status filters | Positive | P1 | At least one matching row exists | Debit + Success | Rows satisfy both filters; verify returned row values and count |
| AS-008 | Filter by same-day inclusive date range | Positive | P1 | A transaction exists on chosen date | From=To=`2026-04-18` | Transaction on boundary date is included; observed sample returned the April 18 IMPS row |
| AS-009 | Filter by date range spanning transactions | Positive | P1 | Seeded dates within range | From=`2026-04-15`, To=`2026-04-20` | Only rows within selected date boundaries are shown; row count matches included records |
| AS-010 | Apply From date only and To date only | Positive | P2 | Records exist both before and after selected boundary | One date bound populated; the other blank | Results obey the supplied bound; exact inclusion semantics for each open-ended range should be confirmed |
| AS-011 | Apply an inverted From/To range | Negative | P2 | Statement loaded | From later than To | Observed input validity remains true; no rows and `No transactions found matching your filters.` / `Showing 0-0 of 0 transactions`; no crash |
| AS-012 | Search by exact transaction reference | Positive | P0 | At least one transaction exists | Existing/dynamically read reference | Exactly one matching row is shown; reference, amount, status, and description are unchanged |
| AS-013 | Search by partial description, case-insensitive | Positive | P1 | Matching description exists | Lowercase partial such as `priya` | Matching description is returned; observed sample matched Priya Sharma |
| AS-014 | Search by description substring with mixed case | Positive | P2 | Matching description exists | Mixed-case substring | Search is expected to be case-insensitive based on the observed lowercase sample; verify against additional cases |
| AS-015 | Search with no matching text | Negative | P1 | Statement has records | Unique unmatched string | Empty result message and 0-0 summary; no stale prior rows remain |
| AS-016 | Search empty or whitespace-only query | Positive / Needs Verification | P2 | Default data present | Empty and whitespace-only search | Determine whether it is treated as no filter or literal search; Clear restores defaults in either case |
| AS-017 | Search with special characters | Negative / Needs Verification | P2 | Statement loaded | Punctuation-only text and characters such as `%`, `_`, quotes | No crash or unintended broad match; exact escaping/search semantics need verification |
| AS-018 | Verify filters are staged until Apply Filters | Positive | P1 | Default table visible | Change one or more filter values without applying | Rows remain unchanged before Apply; applying updates table, count, and pagination state |
| AS-019 | Clear all filters and restore defaults | Positive | P1 | One or more filters/search values applied | Any combination of dates, type, status, search | Clear empties dates/search, resets Type/Status to All, restores full results/count; observed with five rows |
| AS-020 | Validate balance column remains consistent under filtering | Positive / Defect check | P0 | Known transaction rows captured unfiltered and filtered | Apply Debit/Credit or date filters | Each transaction's Balance must remain the same as its unfiltered historical ledger value. Exploration showed changed debit-row balances under Debit filtering; this is an observed defect candidate |
| AS-021 | Verify filtered result count and empty-state summary | Positive / Negative | P1 | Both matching and no-match filters available | Matching filter and no-match filter | Summary count/range matches visible result set; empty state shows `Showing 0-0 of 0 transactions` |
| AS-022 | Navigate multiple statement pages | Positive / Needs Verification | P2 | Seed enough rows to exceed page capacity | Multi-page dataset | Prev/Next and page numbers navigate correctly; rows do not duplicate/skip; summary updates. Not testable with the observed five-row single-page dataset |
| AS-023 | Pagination controls on a single page | Positive | P2 | Dataset fits one page | Five observed rows | Prev and Next remain disabled; current page indicator is 1 |
| AS-024 | Export statement as PDF | Positive / Needs Verification | P2 | Statement data available; download handling enabled | PDF action | A PDF downloads and contains current statement data/account context; exact format/content not observed |
| AS-025 | Export statement as CSV | Positive / Needs Verification | P2 | Statement data available; download handling enabled | CSV action | A CSV downloads with correct columns/rows and values; exact encoding/format not observed |
| AS-026 | Export statement as XLS | Positive / Needs Verification | P2 | Statement data available; download handling enabled | XLS action | Spreadsheet download contains correct columns/rows and values; exact format/content not observed |
| AS-027 | Verify export respects active filters | Positive / Needs Verification | P2 | Filtered result set exists | Filtered rows and each export format | Download includes the same filtered dataset or documented behavior; app behavior not verified |
| AS-028 | Recover after navigation/reload with filters applied | Positive / Needs Verification | P3 | Search/filter applied | Navigate away/back or reload | Determine whether filters persist or reset; table and control values remain consistent |
| AS-029 | Validate table values and debit/credit sign consistency | Positive | P0 | At least one debit and one credit exist | Existing rows | Debit rows have negative amounts and Debit type; credit rows have positive amounts and Credit type; references are unique within the statement |
| AS-030 | Verify filter changes reset pagination to a valid page | Positive / Needs Verification | P2 | Multi-page data; user is on a later page | Apply filter yielding fewer pages | Page resets or remains on a valid page; no blank/stale results; requires multi-page data |

## Detailed Scenarios

### AS-001 - Open Account Statement and verify default table
**Type:** Positive  
**Priority:** P0

**Preconditions:** Authenticated; seeded transaction history exists.

**Test Data:** No filters; existing account statement.

**Steps:**
1. Open `/banking/transactions`.
2. Record account context, filter defaults, headers, visible rows, and result summary.
3. Verify the expected table columns: Date, Description, Reference, Type, Amount, Balance, Status.

**Pre-Transaction / Pre-Filter Verification:** Confirm account context is the expected masked savings account; dates/search empty; Type and Status are All; capture baseline records dynamically.

**Expected Result:** Account Statement loads with all seven headers and the default history; no filter is silently active.

**Post-Filter Verification:** Not applicable; no filter was applied. Confirm visible data is internally consistent and default summary matches the visible row count.

### AS-002 - Apply Debit filter and verify ledger balance integrity
**Type:** Positive with data-integrity check  
**Priority:** P1 (balance integrity assertion is P0)

**Preconditions:** At least one debit and one credit row; capture original values before filtering.

**Test Data:** Type=Debit.

**Steps:**
1. Capture all rows and their reference-to-balance mapping.
2. Select Debit and verify rows do not update until Apply Filters is clicked.
3. Apply the filter and inspect returned rows.
4. Compare every visible reference, direction, amount, status, and Balance to the corresponding baseline row.

**Pre-Filter Verification:** Record baseline row count and original ledger Balance per reference.

**Expected Result:** Only debit records are shown; filters are applied explicitly. The Balance for each reference must remain its original ledger balance.

**Post-Filter Verification:** Assert every row is Debit with a negative amount, and historical Balance values are unchanged. Exploration showed balance values changed for some filtered debit rows; record as a product defect if reproduced.

### AS-008 - Apply same-day date range
**Type:** Positive  
**Priority:** P1

**Preconditions:** At least one transaction on the selected date.

**Test Data:** From and To set to the same known date.

**Steps:** Fill both dates with the same date and click Apply Filters.

**Pre-Filter Verification:** Confirm the baseline contains a row on that date and record its reference.

**Expected Result:** Same-day boundaries are inclusive; observed date 2026-04-18 returned the matching IMPS row.

**Post-Filter Verification:** Only transactions on that date appear; fields in returned rows remain consistent with baseline.

### AS-011 - Apply inverted date range
**Type:** Negative  
**Priority:** P2

**Preconditions:** Statement loaded with existing rows.

**Test Data:** From later than To, such as 2026-04-20 and 2026-04-18.

**Steps:** Enter inverted bounds and apply.

**Pre-Filter Verification:** Record baseline row count; verify both date input values are set as intended.

**Expected Result:** Observed browser input validity remains true, and the app displays the no-match message and 0-0 summary rather than a range-validation message.

**Post-Filter Verification:** No transaction rows are returned; no crash; Clear restores defaults and baseline rows.

### AS-012 - Search by exact reference and description
**Type:** Positive  
**Priority:** P0

**Preconditions:** At least one known transaction exists.

**Test Data:** Exact existing reference; lowercase partial description.

**Steps:** Search exact reference and apply; confirm one matching row. Replace with lowercase description substring and apply again.

**Pre-Filter Verification:** Capture the expected row’s reference, description, amount, status, and balance.

**Expected Result:** Exact reference produces its matching record; observed `TXN003` returned the IMPS row. Lowercase `priya` returned the Priya Sharma description, demonstrating case-insensitive substring search for that sample.

**Post-Filter Verification:** Returned values equal the baseline source row; search does not mutate transaction details.

### AS-015 - No-result handling
**Type:** Negative  
**Priority:** P1

**Preconditions:** Statement has records.

**Test Data:** Unmatched search term or Pending status when no pending row exists.

**Steps:** Apply an unmatched criterion and inspect table body and result summary.

**Pre-Filter Verification:** Record baseline rows and ensure the search criterion is not present in reference/description.

**Expected Result:** `No transactions found matching your filters.` appears with `Showing 0-0 of 0 transactions`; stale prior rows are absent.

**Post-Filter Verification:** Clear restores filters/default records and normal row summary.

### AS-019 - Clear all filters
**Type:** Positive  
**Priority:** P1

**Preconditions:** At least one filter/search is applied.

**Test Data:** Any selected date/type/status/search combination.

**Steps:** Click Clear.

**Pre-Filter Verification:** Record current filter values and result count.

**Expected Result:** Both dates and search empty, Type/Status reset to All, full history restored.

**Post-Filter Verification:** Compare restored rows with the captured baseline; visible count and summary match.

### AS-020 - Preserve historical running balances under filters
**Type:** Positive / Defect check  
**Priority:** P0

**Preconditions:** Baseline records and balances captured before filtering; at least two debit entries.

**Test Data:** Debit-only filter; optionally Credit-only and date range.

**Steps:** Apply a filter and compare each returned record’s Balance with the same reference in the unfiltered baseline.

**Pre-Filter Verification:** Capture Reference -> Balance mapping from the complete ledger.

**Expected Result:** Filtering presentation must not alter a transaction's stored running balance.

**Post-Filter Verification:** Identical reference retains identical historical Balance. During exploration, debit filtered rows showed different Balance values; investigate/fix the application behavior.

### AS-022 - Multi-page navigation
**Type:** Positive / Needs Verification  
**Priority:** P2

**Preconditions:** Controlled statement fixture with more rows than page size.

**Test Data:** Dataset large enough for at least two pages.

**Steps:** Visit page one, next page, previous page, and a numbered page if exposed; apply a filter while on a later page.

**Pre-Filter Verification:** Capture expected ordered reference list and determine page capacity.

**Expected Result:** Navigation presents each row once in stable order; current-page indicators and summary are correct; filtering leaves the user on a valid page.

**Post-Filter Verification:** No duplicates/omissions; Prev/Next disabled at boundaries. This behavior needs verification because only one page was observed.

## Automation Candidates
- AS-001, AS-002, AS-003, AS-004, AS-007, AS-008, AS-012, AS-015, AS-018, AS-019, and AS-021 are strong Playwright UI candidates: stable test IDs exist for filter controls, table, buttons, and pages; use dynamic references and web-first assertions.
- AS-020 is high-value automation and should compare balances by reference before and after filtering; current exploration suggests a reproducible data-integrity issue.
- AS-022 and AS-030 need a seeded multi-page dataset; avoid creating transactions as test setup against shared state.
- AS-024 through AS-027 can be automated after expected file formats/content and download policy are defined.
- All scenarios can be run read-only against transaction data; avoid destructive or financial operations.

## Gaps / Needs Verification
- The statement contains only five rows in the current test dataset, so page capacity, multi-page navigation, and filter/page interaction could not be confirmed.
- Status filter options include Success, Pending, and Failed; seeded history showed only Success. Pending empty behavior was observed; a real Pending/Failed row was not available.
- Export buttons for PDF/CSV/XLS were visible but not activated; actual filenames, MIME types, contents, filtered-export scope, and failure feedback need verification.
- Date parsing/validation for impossible dates, empty bounds, and boundary behavior in one-bound ranges needs verification.
- Search handling for whitespace-only, punctuation/special characters, and exact vs partial matching beyond the observed exact-reference and lowercase-substring examples needs verification.
- Balance fields changed on filtered debit results in exploration; capture as a defect candidate and compare against unfiltered per-reference values.
- Whether filters persist after navigation/reload is not known.

## Test Scenarios
