# Fund Transfer - Test Plan and Scenarios

## Application Overview

This plan covers the observed six-step Fund Transfer wizard on the authenticated banking dashboard: Select Type, Beneficiary, Enter Amount, Review, OTP, and Receipt. The initial screen offers NEFT, IMPS, and RTGS. Its visible descriptions state NEFT settles in batches (1-2 hours during banking hours), IMPS is instant/24x7 with a stated maximum of 5,00,000, and RTGS is real-time with a stated minimum of 2,00,000. These advertised constraints are observed text; only the RTGS minimum was directly validated.

The wizard's observed controls are selected transfer-type buttons and Continue; saved-beneficiary choices and Add New Beneficiary; numeric Transfer Amount, text Purpose / Remarks, a fixed savings From Account; Review; Cancel; Confirm & Send OTP; six separate OTP inputs; Verify & Transfer; and a receipt with Download Receipt, Make Another Transfer, and Go to Dashboard.

Exploration confirmed: no beneficiary selected gives `Please select a beneficiary.`; empty, zero, and negative amounts give `Please enter a valid amount greater than 0.`; RTGS 199999 gives `Minimum amount for RTGS is 2,00,000.`; amount 250001 against available balance 250000 gives `Amount exceeds available balance of ₹2,50,000.`; NEFT amount 1 with blank Purpose / Remarks can reach Review; review displays transfer type, source account, beneficiary, and amount, with Cancel and Confirm & Send OTP. Cancel returned to the initial wizard without a debit. A minimal NEFT transfer was completed using the user-provided demo OTP. The receipt displayed Transfer Successful!, generated reference, amount, date/time, source, beneficiary, transfer type, and Download Receipt. The savings balance decreased by exactly 1; Dashboard Recent Transactions and Account Statement showed matching debit details and Success. Searching Account Statement by reference returned exactly one matching transaction.

## Preconditions
- Use the existing authenticated demo account; credentials are never included in this plan.
- Capture account balance and transaction-history baseline immediately before a transfer. Ensure no concurrent transfers.
- For successful transfer tests, use a disposable/resettable demo account where available. Successful payments change persistent account data; record the generated reference for reconciliation.
- Do not finalize a transfer in shared data unless the test run is explicitly approved. OTP and receipt tests that commit a transfer should use an isolated/resettable account.
- Use existing beneficiaries for deterministic transfer tests. Do not include full beneficiary account numbers in logs or reports.
- Use only one safe invalid-OTP attempt; brute-force/lockout exploration is out of scope.

## Test Data
- Existing saved beneficiary choice: use a beneficiary displayed in the authenticated test account; avoid hardcoding its full account number.
- Transfer types: NEFT, IMPS, RTGS.
- Amounts: empty, 0, -1, 0.01, 1, available balance, available balance + 1; RTGS 199999 and 200000; IMPS maximum and maximum + 1. The app advertises IMPS maximum 500000, but this account's observed balance was 250000, so enforcement above that limit was not isolated.
- Purpose / Remarks: blank and a short unique value; accepted character/length limits are not observed.
- OTP: demo flow uses the fixed OTP supplied by the user. Treat OTP as secret test data; do not write the literal OTP in generated reports/logs.
- Capture reference, date/time, receipt values, pre/post balance, and history row dynamically.

## Test Scenarios

| ID | Scenario | Type | Priority | Preconditions | Test Data | Expected Result |
|----|----------|------|----------|---------------|-----------|-----------------|
| FT-001 | Complete NEFT transfer and reconcile history | Positive | P0 | Authenticated; saved beneficiary; sufficient balance; isolated account | NEFT, amount within balance, remarks optional, demo OTP | Receipt success/reference; exact debit; dashboard and statement show one matching Success row; reference search returns it |
| FT-002 | Complete IMPS transfer within displayed limit | Positive | P0 | Authenticated; saved beneficiary; sufficient balance; resettable account | IMPS, small amount within balance and displayed limit, demo OTP | Transfer succeeds with receipt; debit and history reconcile. IMPS success was not executed during exploration: Needs Verification |
| FT-003 | Complete RTGS transfer at minimum | Positive | P0 | Balance at least 200000; saved beneficiary; isolated account | RTGS, exactly 200000, demo OTP | Review accepts boundary; successful receipt and transaction record reconcile. Review acceptance observed; completed RTGS not verified |
| FT-004 | Reject continuation without transfer type | Negative | P1 | Initial type-selection step | No type selected | Continue is expected to require type; exact feedback Needs Verification |
| FT-005 | Reject continuation without beneficiary | Negative | P1 | Type selected; beneficiary step | No beneficiary selected | Observed `Please select a beneficiary.`; remains on selection step; no transaction |
| FT-006 | Reject missing, zero, and negative amount | Negative | P1 | Type and saved beneficiary selected; baseline recorded | Empty, 0, -1 | Observed amount message `Please enter a valid amount greater than 0.`; no review/OTP/debit |
| FT-007 | Reject amount exceeding available balance | Negative | P1 | Read balance immediately before attempt; type/beneficiary selected | Available balance + 1 | Observed balance-exceeded message; remains on amount step; no debit/history change |
| FT-008 | Enforce RTGS minimum below boundary | Negative | P1 | RTGS selected, beneficiary selected; adequate balance for the minimum | 199999 | Observed `Minimum amount for RTGS is 2,00,000.`; cannot proceed to Review |
| FT-009 | Accept exact RTGS minimum into Review | Positive | P1 | RTGS selected; balance >= 200000; saved beneficiary | 200000 | Observed Continue reaches Review and Review shows RTGS, source, selected beneficiary, and amount. Do not infer successful transfer from Review alone |
| FT-010 | Check IMPS amount at/above advertised maximum | Positive/Negative | P1 | Test account with balance sufficient to separate IMPS cap from balance validation | 500000 and 500001 | UI advertises maximum 500000; actual boundary enforcement Needs Verification because exploration balance was lower |
| FT-011 | Transfer exactly the available balance | Positive / Needs Verification | P1 | Disposable account; exact current balance known; no concurrent debit | Amount equal to available balance | Determine whether amount is accepted and reconciles to zero balance, or another observed rule blocks it; do not assume |
| FT-012 | Reject amount above available balance | Negative | P1 | Baseline balance/history recorded | Balance + smallest currency unit | Observed rejection with no state mutation |
| FT-013 | Accept decimal amount and currency precision | Positive / Needs Verification | P2 | Isolated account; sufficient balance; can reset | 0.01, multiple decimal places | Amount input has step 0.01; accepted precision/rounding/persistence needs verification |
| FT-014 | Submit with Purpose / Remarks blank | Positive | P1 | Valid type/beneficiary/amount | Blank remarks | Observed NEFT amount 1 proceeded to Review with blank remarks; end-to-end optionality across all transfer types needs verification |
| FT-015 | Preserve remarks in review, receipt, and history | Positive / Needs Verification | P2 | Isolated account; saved beneficiary; successful transfer authorized | Unique short remarks | Verify exact normalization/persistence across Review, receipt, and transaction description; no character/length rules were confirmed |
| FT-016 | Cancel from Review | Negative / Observed behavior | P1 | Valid details reach Review; baseline captured | Any safe test amount; select Cancel | Observed Cancel returned to initial transfer-type step without debit; verify balance/history unchanged |
| FT-017 | Verify OTP screen and reject empty OTP | Negative | P1 | Review confirmed into OTP stage on isolated data; do not use repeated attempts | All OTP boxes empty | Verify error/step behavior and no transfer; exact feedback Needs Verification |
| FT-018 | Reject a single invalid OTP | Negative | P1 | Isolated transfer in OTP stage; only one safe wrong attempt | Incorrect six-digit value | Verify error and no debit/history change; exact feedback/remaining attempts Needs Verification |
| FT-019 | Complete OTP verification and display receipt | Positive | P0 | Review details verified; isolated/resettable account; authorized demo OTP | Selected type/beneficiary/amount/remarks | Observed NEFT completed successfully; receipt shows success, generated reference, amount, date/time, source, beneficiary, type, and receipt action |
| FT-020 | Reconcile committed transfer across all transaction views | Positive | P0 | Successful transfer receipt/reference captured | Generated reference | Receipt, dashboard Recent Transactions, and Account Statement agree on reference, date, beneficiary description, type, debit amount, post-transfer balance, and Success; statement reference search yields exactly one row |
| FT-021 | Use Clear after statement reference search | Positive | P2 | Successful transfer is visible and searched by its reference | Generated reference | Search returns matching row; Clear resets search and restores full statement |
| FT-022 | Verify receipt download action | Positive / Needs Verification | P2 | Successful transfer receipt displayed | Download Receipt | Download is available; file type/content and reference integrity need verification |
| FT-023 | Prevent duplicate submission/retry duplication | Negative / Needs Verification | P1 | Isolated/resettable account and deterministic request control | Repeat submit or retry after ambiguous response | Determine duplicate/idempotency behavior; reconcile committed count, references, and total debit |
| FT-024 | Handle session expiry or service/network failure | Negative / Needs Verification | P2 | Controlled fault injection and isolated account | Valid transfer staged before failure | No false success; user-visible recovery and final server/account state reconcile; exact behavior not observed |
| FT-025 | Navigate away or start another transfer from receipt | Positive / Needs Verification | P3 | Receipt shown after successful transfer | Go to Dashboard / Make Another Transfer | Verify destination/reset behavior and confirm navigation does not repeat a transfer |
| FT-026 | Verify transfer-type timing and settlement statuses | Positive / Needs Verification | P3 | Successful NEFT and IMPS transfers available in controlled data | Transfer type and transaction timestamps/status | NEFT description claims batch settlement; IMPS claims instant 24x7; actual settlement scheduling/timing not verified |

## Detailed Scenarios

### FT-001 - Complete NEFT transfer and reconcile history
**Type:** Positive  
**Priority:** P0

**Preconditions:** Authenticated; saved beneficiary available; sufficient balance; isolated/resettable account; no concurrent payment.

**Test Data:** NEFT; selected saved beneficiary; small positive amount; optional unique remarks; fixed demo OTP from protected test configuration.

**Steps:**
1. Record source account balance and latest Recent Transactions/statement entries.
2. Select NEFT, continue, select a saved beneficiary, continue, enter amount/remarks, and continue to Review.
3. Verify type, source, beneficiary, and amount on Review. Confirm & Send OTP, enter the authorized demo OTP, and click Verify & Transfer once.
4. Capture receipt reference, amount, date/time, source, beneficiary, and type.
5. Open Dashboard and verify the balance delta and new Recent Transactions entry.
6. Open Account Statement, search by generated reference, apply filters, and inspect the matching row.
7. Clear search and verify the unfiltered history returns.

**Pre-Transaction Verification:** Correct authenticated source account; baseline balance/history; transfer type and beneficiary are intended; amount is positive and within available balance; Review values match inputs before OTP authorization.

**Expected Result:** Receipt displays Transfer Successful! and a generated reference. The receipt has amount, date/time, source, beneficiary, and NEFT type. Do not assume a separate cancellation after final OTP authorization.

**Post-Transaction Verification:** Balance decreases exactly once by the amount. Exactly one matching debit is present in Dashboard Recent Transactions and Account Statement; reference, date, beneficiary description, type, amount, resulting balance, and Success status reconcile with the receipt. Reference search returns the matching row; Clear restores the full statement.

### FT-005 - Require a beneficiary
**Type:** Negative  
**Priority:** P1

**Preconditions:** Transfer type selected; beneficiary selection step open.

**Test Data:** No beneficiary selection.

**Steps:** Click Continue without selecting a beneficiary.

**Pre-Transaction Verification:** Confirm no saved beneficiary is selected; no amount or transfer has been authorized.

**Expected Result:** Observed `Please select a beneficiary.` feedback; wizard stays on beneficiary selection.

**Post-Transaction Verification:** No review/OTP/receipt; source balance and transaction history unchanged.

### FT-006 - Reject empty, zero, and negative amounts
**Type:** Negative  
**Priority:** P1

**Preconditions:** Transfer type and saved beneficiary selected; baseline balance/history recorded.

**Test Data:** Empty amount, `0`, `-1`.

**Steps:** Submit each amount independently using Continue on Enter Transfer Details.

**Pre-Transaction Verification:** Selected type/beneficiary are valid; exact amount case recorded; no concurrent transfer.

**Expected Result:** Observed `Please enter a valid amount greater than 0.` and no progression to Review.

**Post-Transaction Verification:** No reference, debit, or history row; source balance unchanged.

### FT-007 - Reject amount above available balance
**Type:** Negative  
**Priority:** P1

**Preconditions:** Read current balance immediately before test; selected type/beneficiary; no concurrent debit.

**Test Data:** Current available balance plus one unit.

**Steps:** Enter the calculated amount and continue.

**Pre-Transaction Verification:** Confirm amount exceeds the current displayed balance; capture baseline history.

**Expected Result:** Observed `Amount exceeds available balance of ₹<current balance>.`; flow stays on amount step.

**Post-Transaction Verification:** Balance/history unchanged; no review, OTP, reference, or receipt.

### FT-008 - Enforce RTGS lower boundary
**Type:** Negative  
**Priority:** P1

**Preconditions:** RTGS selected and beneficiary selected; account balance covers the advertised minimum.

**Test Data:** `199999`.

**Steps:** Enter 199999 and continue.

**Pre-Transaction Verification:** Verify RTGS is selected and the entered amount is exactly one unit below displayed minimum.

**Expected Result:** Observed `Minimum amount for RTGS is 2,00,000.`; Review does not open.

**Post-Transaction Verification:** No debit/reference/history change.

### FT-009 - Accept RTGS exact minimum into Review
**Type:** Positive  
**Priority:** P1

**Preconditions:** RTGS chosen; beneficiary selected; available balance at least 200000; no concurrent debit.

**Test Data:** `200000`.

**Steps:** Enter the exact boundary and continue to Review; do not confirm OTP unless using a separate approved success run.

**Pre-Transaction Verification:** Confirm balance and beneficiary; Review shows intended type, source, beneficiary, and amount.

**Expected Result:** Observed exact minimum reached Review. This establishes validation/Review behavior only, not successful RTGS settlement.

**Post-Transaction Verification:** Before OTP authorization, balance/history remain unchanged. If a separate successful test is authorized, reconcile using FT-020.

### FT-016 - Cancel from Review
**Type:** Negative / Observed behavior  
**Priority:** P1

**Preconditions:** Valid details are at Review; capture baseline before entering wizard.

**Test Data:** Safe values; Cancel action.

**Steps:** Click Cancel on Review.

**Pre-Transaction Verification:** Review summary matches intended transfer; final OTP authorization has not occurred.

**Expected Result:** Observed Cancel returned to initial transfer-type selection.

**Post-Transaction Verification:** Balance and history remain unchanged; no generated reference or receipt.

### FT-019 - Verify OTP and receipt success
**Type:** Positive  
**Priority:** P0

**Preconditions:** Review details verified; isolated account; approved demo OTP available.

**Test Data:** Valid six-digit demo OTP kept out of generated reports; selected type, beneficiary, amount, optional remarks.

**Steps:** Confirm and request OTP; verify six single-character OTP inputs; enter authorized OTP and click Verify & Transfer once.

**Pre-Transaction Verification:** Confirm Review details again before authorizing; source balance/history baseline captured.

**Expected Result:** In exploration, correct demo OTP produced `Transfer Successful!`. Receipt displayed reference number, amount, date/time, source, beneficiary, transfer type, and Download Receipt.

**Post-Transaction Verification:** Confirm exact balance debit and history consistency using FT-020. Do not print the OTP or full beneficiary account number.

### FT-020 - Reconcile the transfer across transaction history
**Type:** Positive  
**Priority:** P0

**Preconditions:** Successful transfer receipt and generated reference available; record baseline and post-transfer balance.

**Test Data:** Generated reference, receipt values, displayed source balance.

**Steps:**
1. On Dashboard, locate the recent row by reference and compare date, beneficiary description, reference, negative amount, and status.
2. Open Account Statement and search Description or Ref No. using the generated reference.
3. Apply Filters and assert exactly one matching statement row.
4. Compare date, description, reference, type, amount, resulting balance, and status with receipt and dashboard.
5. Click Clear and confirm the unfiltered history is restored.

**Pre-Transaction Verification:** Capture account balance and existing history before the transfer; record expected recipient/type/amount; reference must be captured from the current receipt, not hard-coded.

**Expected Result:** The generated reference identifies exactly one record; Dashboard and Statement agree with the receipt. Observed statement fields are Date, Description, Reference, Type, Amount, Balance, and Status; observed successful transfer status is `Success`.

**Post-Transaction Verification:** Verify only one debit was applied; current balance equals baseline minus transfer amount; statement running balance agrees with displayed balance; row has matching date, beneficiary description, transfer type, negative amount, and Success; reference search and Clear behave correctly.

## Automation Candidates
- FT-005 through FT-009 and FT-012: deterministic selection/amount validations with assertions that the wizard does not advance and balance/history remain unchanged.
- FT-001, FT-002, FT-003, FT-019, and FT-020: high-value success automation only with isolated/resettable accounts, protected OTP test data, and cleanup/reseed capability. Use generated references dynamically.
- FT-016: cancellation from Review and no-mutation assertions are deterministic and safe for automation.
- FT-020 and FT-021: strong UI automation candidates using observed stable test IDs for transaction search/apply/clear/table and reference-based matching.
- FT-022: automate download presence and file content once output format/content requirements are established.
- FT-023 and FT-024: require deterministic backend idempotency/fault-injection controls; do not run against shared mutable account state.

## Gaps / Needs Verification
- Exact limits for NEFT (minimum/maximum), currency precision/rounding, and whether decimal values beyond two places are rounded or rejected.
- IMPS 500000 maximum is displayed but enforcement was not isolated; current observed available balance was 250000. Verify with a controlled account balance above the cap.
- RTGS minimum boundary rejection/acceptance is observed, but successful RTGS receipt/history was not exercised.
- No-selection transfer-type behavior was not directly submitted; verify actual feedback before asserting a message.
- New-beneficiary form validation and transfer-specific invalid beneficiary behavior were not explored. Do not invent its fields/rules from the separate beneficiary module.
- Remarks maximum length, accepted characters, whitespace normalization, and whether they appear in receipt/history.
- OTP empty/invalid/expired behavior, resend countdown expiry/resend, attempt limits, and session timeout.
- Network/server failures, duplicate transfer protection, ambiguous-response retry behavior, and failed/pending transfer statuses.
- NEFT batch settlement timing and actual IMPS instant/24x7 settlement behavior are not validated by the demo receipt.
- The test transfer executed during exploration was a minimal ₹1 NEFT payment. Account balance and transaction history were updated and remain changed; reset/reseed before independent test execution.

## Test Scenarios
