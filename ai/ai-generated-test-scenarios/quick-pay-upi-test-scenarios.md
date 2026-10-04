# Quick Pay (UPI) - Test Scenarios

## Application Overview

Quick Pay (UPI) is a dashboard widget with UPI ID, Amount, optional Note, and Pay Now. The tested flow validates input and submits immediately without a separate review/confirmation or cancellation screen. Success displays a message and reference, clears fields, debits the savings balance, and adds a Success debit to Recent Transactions and Account Statement. Account Statement has date/type/status filters, description/reference search, pagination, and statement download actions.

Observed validation messages: "Please enter a UPI ID.", "Invalid UPI ID format. Use format: name@upi", "Please enter a valid amount.", "Amount must be greater than 0.", and "Insufficient balance." Amount is numeric with `min=1` in markup, while custom validation says greater than zero. No maximum amount, UPI ID length, Note length, precision, or currency rule was observed.

## Preconditions
- Sign in with the valid configured test account; credentials are not included in this document.
- Run independent cases from a fresh/reset demo account where possible. Before every submission, record displayed available balance and relevant transaction history.
- Use isolated data for successful payments; record the unique generated reference and compare balance/history before and after.
- For negative cases, use inputs confirmed to fail before payment and assert no reference, debit, or new transaction.
- Never rely on a shared balance remaining constant; calculate over-balance input from the balance read immediately before the test.

## Test Data
- Observed valid-format UPI ID: `qa.receiver@upi` (format accepted; recipient ownership/name resolution not observed).
- Invalid candidates: `not-an-upi`, `@upi`, `name@`, `first last@upi`, `name@@upi`, and `qa!receiver@upi`.
- Amount cases: blank, `0`, `-1`, `1`, and current available balance plus one. `250001` against the observed `250000` balance returned insufficient-balance feedback.
- Optional Note: blank or a short unique description such as `QA exploratory payment`; length and allowed character policy are unknown.
- Capture the generated reference dynamically; do not hard-code it.
- Credentials come from configured test data and must never be copied into reports.

## Test Scenarios

| ID | Scenario | Type | Priority | Preconditions | Test Data | Expected Result |
|----|----------|------|----------|---------------|-----------|-----------------|
| QP-001 | Complete a successful UPI payment with a note | Positive | P0 | Authenticated isolated account with sufficient balance | Valid-format ID, amount 1, short note | Success message/reference; fields clear; exact debit; matching Success row in dashboard and statement |
| QP-002 | Submit with UPI ID empty | Negative | P1 | Dashboard widget visible; baseline captured | Empty ID, amount 1 | Required-ID feedback; no reference, debit, or history change |
| QP-003 | Reject malformed UPI IDs | Negative | P1 | Baseline captured for each independent case | Malformed candidates from Test Data; amount 1 | Observed format message; no transaction |
| QP-004 | Check leading/trailing whitespace on UPI ID | Negative / Needs verification | P2 | Isolated/resettable account; baseline captured | ` qa.receiver@upi `, amount 1 | Format check proceeded during exploration, but payment normalization is unconfirmed; characterize without unintended debit |
| QP-005 | Submit with Amount empty | Negative | P1 | Baseline captured | Valid-format ID, blank amount | Valid-amount feedback; no transaction |
| QP-006 | Reject zero and negative amount | Negative | P1 | Baseline captured per case | Valid-format ID, `0`, `-1` | Greater-than-zero feedback; no transaction |
| QP-007 | Reject amount above available balance | Negative | P1 | Read current balance; no concurrent debit | Valid-format ID, balance + 1 | Insufficient-balance feedback; balance/history unchanged |
| QP-008 | Pay with optional Note omitted | Positive | P1 | Isolated/resettable account with sufficient balance | Valid-format ID, amount 1, blank Note | Payment succeeds; generated reference; exact debit and matching Success history row |
| QP-009 | Check UPI ID length and special-character boundaries | Negative / Needs verification | P2 | Isolated test data; baseline captured | Empty local/provider part, repeated `@`, spaces, punctuation, shortest/longest candidates | Known malformed forms rejected; exact grammar/length limits remain unconfirmed |
| QP-010 | Check Note content and boundaries | Positive / Needs verification | P2 | Isolated account; unique notes and references | Blank, ordinary text, spaces, punctuation, lengths around discovered boundary | Note remains optional; characterize acceptance, normalization, truncation/rejection; reconcile successful payments |
| QP-011 | Reconcile payment in transaction history | Positive | P0 | Successful payment and reference available | Generated reference | Recent Transactions and Account Statement agree on description, reference, date, debit amount, balance, and Success; search returns matching row |
| QP-012 | Check duplicate-submit protection | Negative / Needs verification | P1 | Disposable/resettable account and controlled repeat | Same details, repeat/rapid click | Determine duplicate prevention and ensure balance/history reconcile to committed transactions |
| QP-013 | Check session expiry and payment-service failure | Negative / Needs verification | P2 | Controlled fault injection; baseline captured | Valid-format ID and amount within balance | No false success; clear failure/retry outcome; state reconciles with server commit |
| QP-014 | Check direct submission and cancellation/review availability | Positive / Observed behavior | P2 | Dashboard opened, no submission pending | Unsubmitted form values | Pay Now directly submits; no review/confirmation or cancel action observed; no debit before submission |

## Detailed Scenarios

### QP-001 - Complete a successful UPI payment with a note
**Type:** Positive  
**Priority:** P0

**Preconditions:** Authenticated on Dashboard; isolated/resettable demo account; balance sufficient; no concurrent transaction.

**Test Data:** `qa.receiver@upi`; amount `1`; unique short note.

**Steps:**
1. Read and record current balance and recent transaction rows.
2. Enter UPI ID, amount, and note; click Pay Now once.
3. Capture the success text and generated reference; inspect balance and Recent Transactions.
4. Open Transactions and locate the reference.

**Pre-Transaction Verification:** Correct account context; widget has UPI ID, Amount, optional Note and Pay Now; baseline balance/history recorded; values match intended recipient/amount/note.

**Expected Result:** Payment is submitted immediately; no separate review screen; success confirmation includes amount and reference; fields clear.

**Post-Transaction Verification:** Balance decreases exactly by amount; one Success debit row shows recipient, note, reference, date, negative amount, and resulting balance in statement; details match the confirmation.

### QP-002 - Submit with UPI ID empty
**Type:** Negative  
**Priority:** P1

**Preconditions:** Dashboard Quick Pay visible; baseline balance/history captured.

**Test Data:** Blank UPI ID; amount `1`; blank Note.

**Steps:**
1. Confirm UPI ID is empty and enter amount `1`.
2. Click Pay Now.

**Pre-Transaction Verification:** Balance/history baseline recorded; only the mandatory ID is missing; no prior payment is pending.

**Expected Result:** App displays `Please enter a UPI ID.`; submission is rejected.

**Post-Transaction Verification:** No success/reference; balance unchanged; no new transaction row.

### QP-003 - Reject malformed UPI IDs
**Type:** Negative  
**Priority:** P1

**Preconditions:** Run each candidate independently; capture balance/history before each attempt.

**Test Data:** `not-an-upi`, `@upi`, `name@`, `first last@upi`, `name@@upi`, `qa!receiver@upi`; amount `1`.

**Steps:**
1. Enter one candidate and amount `1`.
2. Click Pay Now and record the validation message.
3. Reset the widget and repeat for each candidate.

**Pre-Transaction Verification:** Candidate exactly matches the row under test; baseline state is recorded; amount itself is positive.

**Expected Result:** Observed malformed values display `Invalid UPI ID format. Use format: name@upi.` No payment is submitted.

**Post-Transaction Verification:** No reference/success; balance and transaction history unchanged after every candidate.

### QP-004 - Check leading/trailing whitespace around UPI ID
**Type:** Negative / Needs verification  
**Priority:** P2

**Preconditions:** Isolated/resettable account; no concurrent transaction; record baseline.

**Test Data:** ` qa.receiver@upi `; amount `1`; blank Note.

**Steps:**
1. Enter the ID with leading/trailing spaces and amount `1`.
2. Submit only in a disposable test account; inspect success or validation feedback and resulting history.

**Pre-Transaction Verification:** Record exact input including spaces; baseline balance/history; ensure environment can be reset.

**Expected Result:** During exploration, this ID passed the format stage (the subsequent zero-amount check was reached). End-to-end trimming/preservation and recipient resolution remain Needs verification.

**Post-Transaction Verification:** If success occurs, confirm exactly one debit/reference and determine whether the stored recipient is trimmed or retains spaces. If rejected, confirm no state mutation.

### QP-005 - Submit with Amount empty
**Type:** Negative  
**Priority:** P1

**Preconditions:** Valid-format ID entered; baseline balance/history captured.

**Test Data:** `qa.receiver@upi`; empty Amount; blank Note.

**Steps:**
1. Leave Amount empty and click Pay Now.

**Pre-Transaction Verification:** UPI ID is syntactically valid; Amount is empty; baseline state is known.

**Expected Result:** App displays `Please enter a valid amount.` and does not initiate payment.

**Post-Transaction Verification:** No success/reference; no debit or new history row; balance unchanged.

### QP-006 - Reject zero and negative amounts
**Type:** Negative  
**Priority:** P1

**Preconditions:** Valid-format ID; baseline captured independently for each amount.

**Test Data:** Amounts `0` and `-1`.

**Steps:**
1. Enter `qa.receiver@upi` and amount `0`; submit and record result.
2. Reset, enter amount `-1`; submit and record result.

**Pre-Transaction Verification:** Each amount is visible in the numeric field; balance/history baseline recorded; no other transaction in progress.

**Expected Result:** App displays `Amount must be greater than 0.` for both attempts.

**Post-Transaction Verification:** No generated reference, debit, or new transaction; balance unchanged.

### QP-007 - Reject amount exceeding available balance
**Type:** Negative  
**Priority:** P1

**Preconditions:** Read current available balance immediately before test; prevent concurrent payments.

**Test Data:** Valid-format ID; amount equal to current balance plus one currency unit.

**Steps:**
1. Calculate amount from the displayed balance.
2. Enter valid-format ID and calculated amount; submit.

**Pre-Transaction Verification:** Confirm amount is above the balance read for this run and capture history/balance.

**Expected Result:** App displays `Insufficient balance.`

**Post-Transaction Verification:** No success/reference; balance/history unchanged. A separate maximum/UPI limit was not established.

### QP-008 - Pay with optional Note omitted
**Type:** Positive  
**Priority:** P1

**Preconditions:** Isolated/resettable account with sufficient balance; record balance/history.

**Test Data:** `qa.receiver@upi`; amount `1`; blank Note.

**Steps:**
1. Enter ID and amount, leave Note blank, and click Pay Now once.
2. Capture reference and inspect dashboard/history.

**Pre-Transaction Verification:** Note is empty by design; recipient and amount are correct; baseline balance/history captured.

**Expected Result:** Payment succeeds without Note-required feedback; success message includes a generated reference; fields clear.

**Post-Transaction Verification:** Balance decreases exactly by `1`; one Success debit appears with reference and recipient; note is absent or represented consistently.

### QP-009 - Check UPI ID length and special-character boundaries
**Type:** Negative / Needs verification  
**Priority:** P2

**Preconditions:** Use isolated rejected candidates; baseline captured per attempt.

**Test Data:** Empty local part, empty provider part, repeated `@`, spaces, punctuation, shortest and longest candidate strings; positive amount `1`.

**Steps:**
1. Run each candidate independently and submit.
2. Record whether format feedback appears and any accepted-character behavior.

**Pre-Transaction Verification:** Candidate length/content recorded; amount is positive; baseline state captured.

**Expected Result:** Observed malformed candidates are rejected with the format message. Exact minimum/maximum length, allowed character set, and case sensitivity are Needs verification; do not infer an undocumented boundary.

**Post-Transaction Verification:** Rejected values must not create a reference or mutate balance/history. Any accepted boundary candidate must be tested only in a resettable account and reconciled as a payment.

### QP-010 - Check Note content and boundaries
**Type:** Positive / Needs verification  
**Priority:** P2

**Preconditions:** Isolated/resettable account; sufficient balance; unique test note and reference per successful attempt.

**Test Data:** Blank, ordinary text, leading/trailing spaces, punctuation, and candidate lengths around any limit discovered by product requirements. No limit is currently known.

**Steps:**
1. Use a distinct candidate Note with a valid-format ID and small approved demo amount.
2. Submit and compare confirmation and transaction description; repeat only after reset/reconciliation.

**Pre-Transaction Verification:** Record exact note text, recipient, amount, baseline balance/history, and reset readiness.

**Expected Result:** Note is optional; ordinary text was observed in the transaction description. Special-character policy, trimming, and long-note handling remain Needs verification.

**Post-Transaction Verification:** For each successful run, reconcile one debit/reference and compare displayed note against entered note to identify normalization/truncation. Failed validation must not mutate account state.

### QP-011 - Reconcile payment in transaction history
**Type:** Positive  
**Priority:** P0

**Preconditions:** Successful Quick Pay already completed; reference captured from success message.

**Test Data:** Generated reference, recipient, amount, note, transaction date, and before/after balance from the payment.

**Steps:**
1. Record success message/reference and post-payment dashboard balance.
2. Open Transactions, search by the reference, and apply filters.
3. Compare row values with confirmation and captured values; clear filters.

**Pre-Transaction Verification:** Before the payment used for this scenario, capture balance/history and intended values; verify the reference is newly generated.

**Expected Result:** Statement contains one matching debit with same reference and Success status; reference search returns that row; Clear restores unfiltered history.

**Post-Transaction Verification:** Date, description, Debit type, negative amount, resulting balance, and status agree across Quick Pay, dashboard Recent Transactions, and Account Statement.

### QP-012 - Check duplicate-submit protection
**Type:** Negative / Needs verification  
**Priority:** P1

**Preconditions:** Disposable/resettable account; backend/test harness supports cleanup; avoid shared account.

**Test Data:** Same valid-format ID, amount, and note; controlled repeated click/double-click.

**Steps:**
1. Capture baseline and submit once.
2. Repeat the same submission or double-click only under controlled test setup.
3. Inspect confirmation, references, balance, and history.

**Pre-Transaction Verification:** Record baseline; verify reset capability and that no prior request is pending; use a small amount.

**Expected Result:** Duplicate prevention/idempotency behavior is not known and must be established; do not assume a duplicate warning exists.

**Post-Transaction Verification:** Count server-confirmed transactions, compare references, and ensure total balance change matches actual committed debit count; clean up/reset.

### QP-013 - Check session expiry and payment-service failure
**Type:** Negative / Needs verification  
**Priority:** P2

**Preconditions:** Deterministic session expiry or network/server fault injection; isolated account; baseline captured.

**Test Data:** Valid-format ID and amount within available balance.

**Steps:**
1. Set up one controlled fault condition.
2. Enter valid payment details and submit.
3. Inspect message, authentication/session state, balance, and transaction history; verify backend final state.

**Pre-Transaction Verification:** Confirm fault is active and reproducible; record intended values and baseline; ensure no concurrent payment.

**Expected Result:** No false success. A clear failure/re-authentication/retry outcome should be observed; exact behavior is Needs verification.

**Post-Transaction Verification:** Reconcile backend-confirmed commit with UI balance/history. Retry must not cause an unintended duplicate after an ambiguous response.

### QP-014 - Check direct submission and cancellation/review availability
**Type:** Positive / Observed behavior  
**Priority:** P2

**Preconditions:** Dashboard loaded; do not click Pay Now until ready; no submission pending.

**Test Data:** Entered but unsubmitted valid-format ID/amount, or leave widget blank for control inspection.

**Steps:**
1. Inspect available Quick Pay controls and enter values without submitting.
2. Verify navigation away/back does not submit the payment.
3. In a disposable account, click Pay Now once and observe flow.

**Pre-Transaction Verification:** Confirm balance/history baseline and that Pay Now has not been activated.

**Expected Result:** Pay Now is the only observed payment action; submission goes directly to success/validation without separate review or cancel screen. No payment occurs merely from field entry/navigation.

**Post-Transaction Verification:** For the controlled successful submit, reconcile one success/reference/debit. Cancellation is not applicable to the observed UI; do not expect an unobserved cancel control.

## Automation Candidates
- QP-002 through QP-007: stable validation messages with assertions that balance/history remain unchanged.
- QP-001 and QP-008: primary happy paths; assert confirmation/reference, cleared fields, exact balance delta, and transaction row using isolated/resettable data.
- QP-011: dynamic reference search and cross-view reconciliation.
- QP-003, QP-009, and QP-010: parameterized input coverage, with assertions limited to observed rules until boundaries are specified.
- QP-012 and QP-013: automate only with deterministic reset, duplicate-submit handling, and session/network fault injection.

## Gaps / Needs Verification
- UPI ID grammar, character set, case sensitivity, min/max length, and whitespace normalization.
- Amount minimum, maximum, decimal precision, rounding, and any independent UPI transaction limit. Markup `min=1` differs from custom greater-than-zero feedback; safely tested values were 0, -1, 1, and above available balance.
- Note character/length rules, trimming, and truncation/rejection behavior.
- Whether recipient IDs are checked against a real beneficiary or only syntax-checked; no beneficiary-name confirmation was displayed.
- Duplicate/idempotency, cancellation, session timeout, network/server failure, retry, pending/failed statuses, and ambiguous-response reconciliation.
- Success confirmation included a reference; a transaction date was present in history. Exact time and a separate downloadable Quick Pay receipt were not observed.
- A minimal demo payment was submitted during exploration and the app showed the corresponding debit/balance change. Reset/reseed account state before independent success tests.

## Test Scenarios
