# Loan Calculator - Test Plan and Scenarios

## Application Overview

# Loan Calculator - Test Plan and Scenarios

## Application Overview
The authenticated page is `/banking/loan-calculator`, headed `EMI Calculator`. It has three range sliders: Loan Amount, Interest Rate, and Loan Tenure. Observed attributes are Amount min ₹100,000, max ₹10,000,000, step ₹50,000; Rate min 6%, max 18%, step 0.25%; Tenure min 1, max 30, step 1. The page displays an amount/rate/tenure value beside each slider and has Years/Months segmented buttons for tenure units.

Calculated outputs are Monthly EMI, Total Interest, Total Amount, and Principal, followed by Payment Breakdown and an Amortization Schedule. Schedule columns are Year, Opening Balance, EMI Paid, Interest, Principal, Closing Balance. Default values observed: principal ₹25,00,000, rate 8.5%, tenure 15 Years, monthly EMI ₹24,618, total interest ₹19,31,328, total amount ₹44,31,328, and 15 annual schedule rows. Values recalculate when sliders/tenure controls change. At ₹1,00,000 principal, 18%, and 15 years, monthly EMI displayed ₹1,610; at ₹1,00,000, 18%, and 12 months it displayed ₹9,168 with one schedule row. Switching 12 Months to 1 Year preserved displayed EMI.

The page has an `Apply for Loan` button. Clicking it during exploration triggered a JavaScript alert `Application submitted!` and stayed on `/banking/loan-calculator`; no application form or review step was observed. This is a consequential action and was exploratory evidence only; see preconditions and scenario AL-024 before repeating in a controlled environment.

## Preconditions
- Use the existing authenticated test account; never include credentials in logs or test data.
- Calculator slider changes are local/read-only until Apply for Loan is activated; capture baseline values before changing controls.
- Do not click Apply for Loan on shared/prod-like data. Its observed behavior reports submission immediately, with no review or application details screen. Any repeated application-action test requires explicit authorization and an isolated environment.
- Use UI-displayed values and calculate only relational expectations unless an approved EMI formula, compounding convention, and rounding policy are supplied.
- No loan application was created or confirmed through a persistent application record during exploration; the alert was observed but downstream effects were not verified.

## Test Data
- Loan Amount slider: minimum 100000, maximum 10000000, step 50000.
- Interest Rate slider: minimum 6, maximum 18, step 0.25.
- Loan Tenure slider: minimum 1, maximum 30, step 1; unit can be Years or Months.
- Observed default: amount 2500000, rate 8.5, tenure 15 Years.
- Boundary and representative values: amount 100000, 105000, 10000000; rate 6, 6.25, 18; tenure 1, 2, 15, 30 years and 12, 180, 360 months.
- Apply action: `Apply for Loan`; observed alert text: `Application submitted!`.
- Do not assume an APR/compounding or rounding rule absent product documentation.

## Test Scenarios

| ID | Scenario | Type | Priority | Preconditions | Test Data | Expected Result |
|----|----------|------|----------|---------------|-----------|-----------------|
| LC-001 | Load calculator with defaults and all result sections | Positive | P0 | Authenticated | Default inputs | EMI Calculator, three sliders, unit control, four summary outputs, breakdown, schedule, and apply action are visible |
| LC-002 | Verify slider bounds and steps | Positive / Boundary | P0 | Calculator loaded | Amount 100000..10000000 step 50000; rate 6..18 step 0.25; tenure 1..30 step 1 | Native slider values stay within observed bounds/steps; displayed values match slider values |
| LC-003 | Recalculate outputs after changing principal | Positive | P0 | Calculator loaded | Minimum, default, maximum principal with fixed rate/tenure | Principal display tracks input and all loan-dependent outputs/schedule recalculate; exact outputs require approved formula |
| LC-004 | Recalculate outputs after changing interest rate | Positive | P0 | Calculator loaded | 6%, 8.5%, 18%, fixed principal/tenure | Rate display updates; EMI/interest/total recalculate; higher rate should not reduce cost for same principal/term, subject to documented rounding |
| LC-005 | Recalculate outputs after changing tenure in Years | Positive | P0 | Calculator in Years mode | 1, 15, 30 years | Tenure display and schedule duration update; EMI and totals recalculate consistently |
| LC-006 | Recalculate outputs after changing tenure in Months | Positive | P0 | Calculator in Months mode | 12, 180, 360 months | Display reflects months and outputs/schedule recalculate for corresponding term; observed 180 months showed 15 annual rows |
| LC-007 | Switch 12 Months to 1 Year | Positive | P1 | Select Months and set slider to 12 | 12 months then Years | Tenure converts to 1 Year and equivalent EMI remains equal; observed |
| LC-008 | Switch Years to Months | Positive | P1 | Years mode with a whole-year term selected | 1, 15, or 30 years | Display converts to equivalent months without changing effective duration or unexpectedly changing EMI; verify each supported edge |
| LC-009 | Verify principal amount output | Positive | P1 | Calculator loaded | Any valid amount | Principal output equals slider principal with correct INR grouping |
| LC-010 | Verify total amount relationship | Positive | P1 | Calculator loaded | Representative inputs | Total Amount equals Principal plus Total Interest, subject to the app's displayed rounding; observed default values reconcile |
| LC-011 | Verify amortization schedule length for years | Positive | P1 | Years mode | 1 and 15 years | Schedule rows cover selected annual periods; observed 15 years produced 15 rows |
| LC-012 | Verify amortization schedule length for months | Positive / Needs Verification | P1 | Months mode | 12, 180, 360 months | Observed 12 months produced 1 row and 180 months produced 15 annual rows; verify schedule groups months into years and has correct final partial period |
| LC-013 | Verify schedule opening/closing balance roll-forward | Positive | P1 | Schedule has one or more rows | Any valid scenario | First opening balance equals principal; each subsequent opening balance equals previous closing balance; final closing balance reaches zero or documented residual |
| LC-014 | Verify each period payment split | Positive | P1 | Schedule visible | Any valid scenario | EMI paid equals interest plus principal components within rounding; exact column semantics and rounding need verification |
| LC-015 | Verify totals against schedule sums | Positive | P1 | Schedule visible | Any valid scenario | Sum schedule interest/principal/payment reconciles to summary interest/principal/total within documented rounding; formulas are not yet documented |
| LC-016 | Verify zero-interest boundary is unavailable or handled | Negative / Needs Verification | P2 | Calculator loaded | Attempt rate below slider min only in a controlled test harness; normal UI cannot select it | UI constrains rate to 6..18; if invalid input is injectable, no divide-by-zero/invalid result; server/API behavior not observed |
| LC-017 | Verify slider keyboard operation | Positive | P1 | Focus each slider | Home, End, Arrow keys | Keyboard changes value within bounds by documented step and recalculates results; slider remains accessible by label |
| LC-018 | Verify result stability at minimum amount and rate | Positive / Boundary | P1 | Calculator loaded | ₹100000, 6%, 1 year | Finite non-negative outputs; schedule principal is repaid; exact expected monetary values need approved calculation policy |
| LC-019 | Verify maximum amount/rate/tenure combination | Positive / Boundary | P1 | Calculator loaded | ₹10000000, 18%, 30 years | No overflow, blank, NaN, or layout break; outputs remain finite and schedule covers full term |
| LC-020 | Verify chart breakdown follows principal and interest | Positive | P1 | Calculator loaded | Low-rate/short-term and high-rate/long-term scenarios | Breakdown proportions/labels respond to inputs and sum to 100% within rounding; exact chart semantics need verification |
| LC-021 | Verify unit toggle selected state | Positive | P2 | Calculator loaded | Toggle Years/Months repeatedly | Only selected unit appears active; effective duration and outputs remain consistent across equivalent values |
| LC-022 | Verify rapid slider changes do not leave stale outputs | Positive / Stress | P2 | Calculator loaded | Rapid changes across all sliders | Final outputs correspond to final slider values; no stale calculation or mixed-state display |
| LC-023 | Verify amount/rate/tenure labels and currency formatting | Positive | P2 | Calculator loaded | Minimum/default/maximum values | Displays use consistent INR grouping, percentage precision, and unit text; exact decimal/rounding policy needs confirmation |
| LC-024 | Inspect Apply for Loan action and submission safety | Negative / Consequential | P0 | Isolated environment and explicit authorization before activating | Current calculated values | Observed click immediately raised `Application submitted!` and stayed on calculator; no review/application-details step. Verify server-side record, duplicate prevention, and user feedback only in isolated approved environment |
| LC-025 | Verify Apply action never submits invalid calculator state | Negative / Needs Verification | P1 | Controlled environment; do not create repeated real applications | Values at slider boundaries or tampered invalid state | No invalid application is created; exact validation/message and persistent effects need verification |
| LC-026 | Verify back navigation after Apply response | Positive / Needs Verification | P2 | Application action executed only in isolated/authorized environment | One controlled application | Determine whether a success page, confirmation, or application record exists; exploration stayed on calculator after a JavaScript alert |
| LC-027 | Verify calculator is non-persistent before Apply | Positive | P2 | Change all calculator inputs but do not activate Apply | Non-default slider settings | No account/loan records are created by adjusting sliders; navigation/reload reset/persistence behavior needs verification |
| LC-028 | Verify console/runtime stability for boundary combinations | Negative | P2 | Calculator loaded | Minimum and maximum combinations, unit toggles | No UI crash, uncaught error, NaN, or infinite values; console inspection during extreme combinations is recommended |

## Detailed Scenarios

### LC-001 - Load calculator and verify defaults
**Type:** Positive  
**Priority:** P0

**Preconditions:** Authenticated; calculator page available.

**Test Data:** Default calculator state.

**Steps:**
1. Open `/banking/loan-calculator`.
2. Capture slider values and displayed labels.
3. Verify result summary, breakdown section, amortization table, and Apply for Loan action.

**Pre-Action Verification:** Ensure no loan application action is pending; record amount/rate/term defaults.

**Expected Result:** Three labeled sliders, Years/Months unit control, Monthly EMI, Total Interest, Total Amount, Principal, Payment Breakdown, Amortization Schedule, and Apply for Loan are present. Observed default values are amount 2500000, rate 8.5, term 15 Years; displayed outputs are formatted INR values.

**Post-Action Verification:** Read-only; no application submission or persistent loan/account change.

### LC-002 - Verify slider bounds and increments
**Type:** Positive / Boundary  
**Priority:** P0

**Preconditions:** Calculator loaded.

**Test Data:** Amount min/max/step 100000/10000000/50000; rate 6/18/0.25; tenure 1/30/1.

**Steps:** Focus each slider; use Home/End then arrow-key increments; inspect input value and displayed value.

**Pre-Action Verification:** Capture baseline values and ensure unit mode known before each tenure boundary.

**Expected Result:** Sliders never move outside bounds, respect their increments, and labels/output update to selected values.

**Post-Action Verification:** Results remain finite and schedule is internally coherent; no loan is applied.

### LC-013 - Verify amortization schedule consistency
**Type:** Positive / Data Integrity  
**Priority:** P1

**Preconditions:** A valid calculator combination is selected.

**Test Data:** Default and at least one boundary scenario.

**Steps:**
1. Capture principal, total interest, total amount, and each schedule row.
2. Compare first opening balance to principal and adjacent closing/opening balances.
3. Compare period payment components and final closing balance to documented rounding rules.

**Pre-Action Verification:** Record all three slider values and selected unit; ensure outputs finished updating.

**Expected Result:** Opening/closing balances roll forward; principal/interest components reconcile with EMI and summary totals within approved rounding policy. Exact calculation policy needs product confirmation.

**Post-Action Verification:** Read-only; no application is submitted.

### LC-024 - Inspect Apply for Loan action safely
**Type:** Negative / Consequential  
**Priority:** P0

**Preconditions:** Isolated environment and explicit approval to activate the action.

**Test Data:** Current calculator values only; do not include personal or financial data beyond seeded demo values.

**Steps:** During exploration, clicking Apply for Loan showed a JavaScript alert with `Application submitted!` and left the user on the calculator page. Do not repeat on a shared account. In a controlled test environment, observe any application record, confirmation, and duplicate behavior.

**Pre-Action Verification:** Capture current calculator state and confirm test account is disposable and that application submission is authorized.

**Expected Result:** Observed UI message is `Application submitted!`; no review or details form appeared before submission. Persistent backend/account effect remains Needs Verification.

**Post-Action Verification:** In an authorized isolated test only, verify whether an application record was created, whether repeat activation duplicates it, and whether calculator state remains unchanged. Do not assume a loan disbursement occurred.

## Automation Candidates
- LC-001, LC-002, LC-003 through LC-012, LC-017 through LC-023, LC-027, and LC-028 are suitable for UI automation using slider test IDs and output test IDs; assert mathematical relationships and boundaries without inventing unsupported exact calculations.
- Use a deterministic calculation oracle only after product approves the interest compounding, periodic rate, EMI formula, and rounding policy.
- LC-024 through LC-026 must use an isolated test account and explicit authorization; the observed Apply button immediately reports submitted, so do not run repeatedly against shared data.

## Gaps / Needs Verification
- EMI formula, periodic compounding convention, installment due-date convention, currency rounding mode, and treatment of final residual balance.
- Whether years and months are exact equivalent terms at unit conversion boundaries and whether non-year-divisible month terms display a partial annual schedule row.
- Minimum/maximum and step are exposed as range input attributes, but server-side handling of tampered values is not known.
- Full formula reconciliation for schedule components and breakdown visualization.
- Apply for Loan click showed a JavaScript alert and stayed on the calculator route. Whether it creates an application record, blocks duplicates, or has further confirmation is unverified; the alert was triggered once during exploration only.
- Application terms/fees/eligibility, rate basis, credit score/age/income rules, and actual loan approval/disbursement are not displayed in the explored calculator form and are not asserted here.

No scripts are included in this plan.

## Test Scenarios
