# Fixed Deposits - Test Plan and Scenarios

## Application Overview

# Fixed Deposits - Test Plan and Scenarios

## Application Overview
The authenticated Fixed Deposits page is `/banking/fixed-deposit`, headed `Your Fixed Deposits`. It displays existing FD cards and an FD Summary table. Each observed card shows an FD ID, Active/Matured status, principal, annual rate, tenure, start/end dates, maturity amount, and elapsed percentage. The summary columns are ID, Amount, Rate, Tenure, Start, Maturity, and Status.

The `Open New Fixed Deposit` form has a numeric Amount field, placeholder `Enter deposit amount`, `min=10000`, helper text `Amount (min ₹10,000)`, five tenure buttons (6 Months, 1 Year, 2 Years, 3 Years, 5 Years), and an `Open Fixed Deposit` button. The button starts disabled. With no amount, it remained disabled. Amount 9999, 0, and -1 are natively invalid due to rangeUnderflow and left it disabled. Amount 10000 alone left it disabled; selecting a tenure enabled the button. Tenure selection is highlighted visually. No account source selector, rate selector, maturity preview, or review step was observed.

The savings account displayed a balance of ₹2,50,000. Entering ₹250001 and selecting a tenure enabled Open Fixed Deposit with no visible balance warning. This was not submitted; whether the final action prevents overdraw/insufficient funds is Needs Verification. The form was not submitted during exploration, so success/error message, newly created ID, balance mutation, status, and persistence are unverified.

Six existing records were visible, including Active and Matured statuses and tenures of 6 months, 1 year, 2 years, 3 years, and 5 years. Maturity amounts and elapsed percentages were displayed on cards. Existing account data was observed read-only; no records were opened, changed, or deleted.

## Preconditions
- Use the existing authenticated test account; credentials must not appear in this document or logs.
- Record savings balance and FD Summary rows before any create action.
- Successful FD creation changes account data and likely withdraws principal; use a disposable/resettable account for creation and over-balance tests.
- For read-only card/summary checks, seed or snapshot a known FD portfolio; do not rely on a shared account remaining unchanged.
- Never activate `Open Fixed Deposit` during exploratory checks on a shared account.
- Creation outcome, cancellation, withdrawal/closure, and premature withdrawal are not confirmed UI flows; include only after further product exploration.

## Test Data
- Amounts: blank, 0, -1, 9999, 10000, 10001, exact available balance, available balance + 1, and large numeric values near any verified maximum. Only minimum attribute 10000 was observed; maximum is unknown.
- Tenures shown: `6 Months`, `1 Year`, `2 Years`, `3 Years`, `5 Years`.
- Observed fixed-deposit statuses: `Active`, `Matured`.
- Current observed source savings balance: ₹2,50,000; calculate dynamic balance cases at runtime in any later test implementation.
- Existing records display interest rates from 5.5% to 7.25% p.a.; whether rates depend on tenure, customer category, or product rules needs verification.
- No test data file is proposed or required for the scenario plan.

## Test Scenarios

| ID | Scenario | Type | Priority | Preconditions | Test Data | Expected Result |
|----|----------|------|----------|---------------|-----------|-----------------|
| FD-001 | Load Fixed Deposits overview and summary | Positive | P0 | Authenticated, seeded FD portfolio | Existing portfolio | Cards and summary load; account context, records, and columns are coherent |
| FD-002 | Create FD at minimum amount for each tenure | Positive | P0 | Disposable/resettable account with sufficient balance; create action authorized | ₹10,000; each of five tenures | Button enables only with valid amount and tenure; successful receipt/row/balance update. Final submission behavior Needs Verification |
| FD-003 | Verify principal, rate, tenure, dates and maturity consistency | Positive | P0 | Known FD records and documented calculation rules available | Existing or newly created FD | Card and summary show same values; maturity/date/rate calculation reconciles with approved product formula. Formula not provided: Needs Verification |
| FD-004 | Prevent submission when amount is empty | Negative | P1 | Fixed Deposit page; no amount entered | Blank amount; optional tenure selection | Open button disabled; no record/balance change |
| FD-005 | Reject zero and negative principal | Negative | P1 | Form available; tenure selected if needed | 0 and -1 | Native number validity/minimum prevents enabling or submission; no mutation. Observed disabled with these values |
| FD-006 | Reject below-minimum amount | Negative | P1 | Form available; tenure selected | ₹9,999 | Amount violates `min=10000`; button remains disabled; no record/balance change. Observed |
| FD-007 | Accept exact minimum amount with tenure selected | Positive | P1 | Disposable account with sufficient balance | ₹10,000; each tenure | Button is enabled after valid amount and tenure selection. Observed enablement; completed opening remains Needs Verification |
| FD-008 | Require a tenure selection | Negative | P1 | Form available; valid amount entered | ₹10,000; no tenure selected | Button stays disabled. Observed |
| FD-009 | Check available-balance boundary | Negative / Needs Verification | P1 | Isolated account; exact live balance read; no concurrent account activity | Balance + 1 and exact balance | UI currently enables submission above balance with no warning. Verify final server validation rejects insufficient funds, shows clear feedback, and leaves account/FD list unchanged. Exact-balance success rules need verification |
| FD-010 | Verify amount just above minimum | Positive | P2 | Disposable/resettable account, sufficient balance | ₹10,001; selected tenure | Form accepts candidate and calculates/persists exact principal. Max/precision rules remain unverified |
| FD-011 | Verify maximum amount and large-number handling | Negative / Needs Verification | P2 | Isolated account and product-defined maximum available | Maximum, maximum + smallest unit, oversized numeric input | Do not assert an undocumented cap; determine safe rejection/format behavior and no mutation on invalid amounts |
| FD-012 | Switch tenure selection | Positive | P2 | Valid amount entered | Select each tenure successively | Exactly one tenure appears selected; button readiness reflects selection; changing tenure does not alter amount unexpectedly |
| FD-013 | Verify tenure-specific maturity and interest rate | Positive / Needs Verification | P1 | Approved rate table/calculation rule documented; disposable data for new FD | Same principal across all five tenures | Rate, maturity date, maturity amount, and any preview follow documented rules. Only displayed examples observed; business formula needs verification |
| FD-014 | Validate card/summary record consistency | Positive | P1 | At least one record exists | Compare matching FD by ID | ID, principal, rate, tenure, start/maturity dates, maturity amount, and status match between card and summary |
| FD-015 | Show Active versus Matured status correctly | Positive | P1 | Dataset includes both statuses | Observed active and matured records | Status is consistent across card and summary and aligns with dates; maturity status transition timing needs verification |
| FD-016 | Verify elapsed percentage boundaries | Positive / Needs Verification | P2 | Controlled dates or deterministic records | New, in-progress, maturity-date, past-maturity FDs | Percentage remains bounded and consistent with elapsed term; observed values include partial and 100%; exact rounding/clamping formula not specified |
| FD-017 | Verify dates and tenure arithmetic | Positive / Needs Verification | P2 | Known start date and approved date rules | 6-month/annual/multi-year terms; leap-year boundary | Maturity date follows defined calendar/leap-year policy. Existing examples displayed, but date arithmetic rules are undocumented |
| FD-018 | Verify successful FD creation and generated record | Positive / Needs Verification | P0 | Disposable/resettable account, valid balance, selected tenure | Minimum or small valid amount | Determine success/confirmation message, generated FD ID, status, dates, interest/maturity values, summary/card updates, and balance delta. Not submitted during exploration |
| FD-019 | Verify persistence after navigation/reload | Positive / Needs Verification | P1 | A newly created FD exists | Capture new FD ID | Created record remains in card and summary with same values after navigation/reload; creation persistence not observed |
| FD-020 | Reject unsupported tenure/amount payload tampering | Negative / Needs Verification | P2 | Controlled isolated environment and supported test tooling | Invalid tenure value or malformed numeric payload | Server-side validation rejects unsupported values; UI controls expose only five observed tenure choices. Tampering not tested |
| FD-021 | Verify concurrent/double submission protection | Negative / Needs Verification | P2 | Isolated account and deterministic test/reset controls | Rapid repeated Open Fixed Deposit activation | At most one FD is created/debit applied per intended request, or documented duplicate handling; not tested |
| FD-022 | Verify network/server failure during FD opening | Negative / Needs Verification | P2 | Isolated account and controlled fault injection | Valid staged application interrupted at submission | No false success or partial inconsistent record; retry/reconciliation behavior needs verification |
| FD-023 | Verify keyboard and accessible tenure selection | Positive | P3 | Form opened with keyboard/screen reader testing | Tab/arrow/Enter interaction | Tenures and amount/button expose accessible names and selected state; observed tenure uses visual selection only, ARIA state needs verification |
| FD-024 | Verify navigation away with incomplete form | Positive / Needs Verification | P3 | Unsaved amount/tenure entered; do not submit | Valid staged inputs | Determine whether values reset or persist on return; no FD should be created by navigation |
| FD-025 | Check presentation/formatting of currency and dates | Positive | P3 | Existing summary records visible | Small/large principals, decimal maturity amounts, dates | Consistent INR grouping/decimals and date formats across card and summary; observed maturity display sometimes omits trailing zeroes |
| FD-026 | Verify zero-record and large-portfolio states | Positive / Needs Verification | P3 | Controlled empty and multi-record datasets | Empty portfolio; many FDs | Clear empty state, list/table consistency, scrolling/pagination/performance. Not available in current six-record dataset |

## Detailed Scenarios

### FD-001 - Load Fixed Deposits overview and summary
**Type:** Positive  
**Priority:** P0

**Preconditions:** Authenticated; known read-only or resettable FD dataset.

**Test Data:** Existing FD portfolio, including Active and Matured examples.

**Steps:**
1. Open `/banking/fixed-deposit`.
2. Verify heading, cards, Open New Fixed Deposit form, and FD Summary table.
3. Compare each card’s identifying values against the summary row with the same FD ID.

**Pre-Action Verification:** Record number of existing FD cards and summary rows; capture current balance without displaying account credentials or full account identifiers.

**Expected Result:** Six seeded records were observed. Each card/summary row contains ID, amount, rate, tenure, dates, maturity value, and status where applicable.

**Post-Action Verification:** Read-only case: no account or FD mutation; card and summary data agree by record ID.

### FD-004 - Reject empty, zero, negative, or below-minimum amount
**Type:** Negative  
**Priority:** P1

**Preconditions:** Fixed Deposit form visible; do not activate Open Fixed Deposit.

**Test Data:** Blank, `0`, `-1`, `9999`.

**Steps:** Enter each amount separately; optionally select a tenure; inspect native validity and button disabled state.

**Pre-Action Verification:** Capture baseline FD IDs/count and source balance; confirm exact amount and tenure state.

**Expected Result:** Amount field has observed minimum 10000. Empty/zero/negative/9999 are invalid or below minimum; Open button stays disabled. This was observed for blank, 0, -1, and 9999.

**Post-Action Verification:** No new FD ID/summary row; balance unchanged because submit was never activated.

### FD-009 - Reject FD principal exceeding available balance
**Type:** Negative / Needs Verification  
**Priority:** P1

**Preconditions:** Disposable/resettable account; live available balance known; no concurrent changes.

**Test Data:** Current balance plus one; choose a tenure.

**Steps:** Enter amount above balance, choose tenure, inspect the button. Only proceed with server submission in an isolated account approved for mutation.

**Pre-Action Verification:** Compare amount to displayed available balance and record FD count/IDs.

**Expected Result:** Exploration found the UI enables Open FD above available balance and shows no warning. Final validation behavior must be verified; expect server rejection only if confirmed by product behavior.

**Post-Action Verification:** If a safe negative submission is authorized, no FD record or debit should result; capture exact message/status. Otherwise keep outcome Needs Verification.

### FD-018 - Verify successful FD creation and receipt
**Type:** Positive / Needs Verification  
**Priority:** P0

**Preconditions:** Disposable/resettable account with sufficient balance; creation approved; account and FD baseline captured.

**Test Data:** Valid principal at/above minimum; selected tenure.

**Steps:** Submit valid form once in isolated data; capture any confirmation, generated ID, rates, dates, and maturity details; revisit page and reconcile card and summary.

**Pre-Action Verification:** Validate amount, tenure, available funds, and baseline account/FD state before activating Open Fixed Deposit.

**Expected Result:** Not observed during exploration. Confirm success message, new ID, rate/maturity calculations, active status, and updated summary.

**Post-Action Verification:** Confirm one new FD row/card; principal is deducted exactly once; balance and maturity information reconcile; record persists after navigation/reload.

## Automation Candidates
- FD-001 and FD-014: read-only card/summary consistency using dynamic record IDs.
- FD-004 through FD-008: input validity, selection, and button enablement; deterministic and non-mutating.
- FD-009: automate only with an isolated account and controlled safe submission; current UI allows an above-balance amount to reach enabled state.
- FD-013, FD-017, FD-018, and FD-019: only after rate/date formula and creation/persistence contract are established and a resettable account exists.
- FD-020 through FD-022: require backend-supported tampering/fault/reset test environment; do not test against shared mutable banking data.

## Gaps / Needs Verification
- Successful FD creation confirmation/receipt, generated FD ID, server response, balance deduction, and summary refresh/persistence.
- Whether amount is limited by available savings balance; UI enabled Open above displayed balance during exploration.
- Maximum principal, decimal/precision/rounding rules, and whether whole rupees are required.
- Exact rate schedule by tenure and whether rate changes based on deposit amount, customer/account attributes, or promotional conditions.
- Maturity calculation formula, compounding frequency, tax/TDS, rounding, and date arithmetic (leap years/month-end).
- Tenure selection default or whether default is none; selected visual style had no observed `aria-pressed`/selected property.
- Early withdrawal, closure, renewal, nomination, lien, and tax certificate capabilities were not visible in this explored page and are outside confirmed UI coverage.
- Elapsed percentage calculation, rounding, behavior for future/start/matured dates, and whether progress updates dynamically.
- Empty state, pagination/large portfolio behavior, navigation persistence for incomplete form, and accessibility behavior.
- Maturity amounts in cards sometimes display fractional values with differing decimal places; currency presentation policy needs confirmation.

## Test Scenarios
