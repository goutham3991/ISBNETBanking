import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageFixture'

test.describe('Quick Pay - UPI payments and history', () => {
    test.beforeEach('Navigate to Dashboard', async ({ page }) => {
        await page.goto('/banking/dashboard')
    })

    test('Quick Pay TC001 - Complete UPI payment with a note', async ({ page, accountPage, transactionPage }) => {
        const upiId = 'qa.receiver@upi'
        const amount = 1
        const note = `QP001-${new Date().toISOString().slice(11, 19).replaceAll(':', '')}`

        // 1. Verify QP-001 preconditions and capture the dashboard baseline.
        await accountPage.validateAccountPage()
        await accountPage.verifyUpiQuickPaySection()
        const balanceBefore = await accountPage.getAccountBalance()
        expect(balanceBefore).toBeGreaterThanOrEqual(amount)

        const recentTransactions = page.getByRole('table').filter({ hasText: 'Ref No' })
        await expect(recentTransactions).toHaveCount(1)
        const recentRowsBefore = await recentTransactions.getByRole('row').allTextContents()

        // 2. Submit the valid-format UPI ID, amount, and unique note once.
        await accountPage.enterUPI(upiId)
        await accountPage.enterUPIAmount(String(amount))
        await accountPage.enterUPINotes(note)
        await accountPage.clickPayNow()

        const successMessage = accountPage.quickPayViaUPISection.getByTestId('upi-success')
        await expect(successMessage).toBeVisible()
        await expect(successMessage.locator('p').first()).toHaveText('Payment Successful!')
        const successDetails = await successMessage.innerText()
        await expect(successMessage.locator('p').last()).toContainText(`₹${amount} sent successfully. Ref:`)
        const reference = successDetails.match(/Ref:\s*(\S+)/)?.[1]
        expect(reference, 'success message should contain a transaction reference').toBeTruthy()

        await expect(accountPage.enterUPIId).toHaveValue('')
        await expect(accountPage.enterAmount).toHaveValue('')
        await expect(accountPage.enterNotes).toHaveValue('')

        // 3. Verify the exact balance delta and matching Recent Transactions row.
        const balanceAfter = await accountPage.getAccountBalance()
        expect(balanceAfter).toBe(balanceBefore - amount)

        expect(recentRowsBefore.join('\n')).not.toContain(reference)
        const dashboardPaymentRow = recentTransactions.getByRole('row').filter({ hasText: reference })
        await expect(dashboardPaymentRow).toHaveCount(1)
        const dashboardCells = dashboardPaymentRow.getByRole('cell')
        await expect(dashboardCells.nth(0)).not.toBeEmpty()
        await expect(dashboardCells.nth(1)).toContainText(`UPI Payment to ${upiId} - ${note}`)
        await expect(dashboardCells.nth(2)).toHaveText(reference)
        await expect(dashboardCells.nth(3)).toHaveText(`-₹${amount}`)
        await expect(dashboardCells.nth(4)).toHaveText('Success')

        // 4. Reconcile the same reference in Account Statement.
        await transactionPage.goToTransactionPage()
        await transactionPage.validateTransactionPage()
        const statementRow = transactionPage.transactionTable.getByRole('row').filter({ hasText: reference })
        await expect(statementRow).toHaveCount(1)
        const statementCells = statementRow.getByRole('cell')
        await expect(statementCells.nth(0)).not.toBeEmpty()
        await expect(statementCells.nth(1)).toContainText(`UPI Payment to ${upiId} - ${note}`)
        await expect(statementCells.nth(2)).toHaveText(reference)
        await expect(statementCells.nth(3)).toHaveText('debit')
        await expect(statementCells.nth(4)).toHaveText(`-₹${amount}`)
        await expect(statementCells.nth(5)).toHaveText(balanceAfter.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }))
        await expect(statementCells.nth(6)).toHaveText('Success')
    })

    test('Quick Pay TC002 - Reconcile UPI payment in transaction history', async ({ page, accountPage, transactionPage }) => {
        const upiId = 'qa.receiver@upi'
        const amount = 1
        const note = `QP011-${Date.now()}`

        // 1. Complete a small payment and capture its generated reference and baseline values.
        await accountPage.validateAccountPage()
        await accountPage.verifyUpiQuickPaySection()
        const balanceBefore = await accountPage.getAccountBalance()
        expect(balanceBefore).toBeGreaterThanOrEqual(amount)

        const recentTransactions = page.getByRole('table').filter({ hasText: 'Ref No' })
        await expect(recentTransactions).toHaveCount(1)
        const recentRowsBefore = await recentTransactions.getByRole('row').allTextContents()

        await accountPage.enterUPI(upiId)
        await accountPage.enterUPIAmount(String(amount))
        await accountPage.enterUPINotes(note)
        await accountPage.clickPayNow()

        const successMessage = accountPage.quickPayViaUPISection.getByTestId('upi-success')
        await expect(successMessage).toBeVisible()
        await expect(successMessage.locator('p').first()).toHaveText('Payment Successful!')
        const successDetails = await successMessage.innerText()
        await expect(successMessage.locator('p').last()).toContainText(`₹${amount} sent successfully. Ref:`)
        const reference = successDetails.match(/Ref:\s*(\S+)/)?.[1]
        expect(reference, 'success message should contain a transaction reference').toBeTruthy()

        const balanceAfter = await accountPage.getAccountBalance()
        expect(balanceAfter).toBe(balanceBefore - amount)

        expect(recentRowsBefore.join('\n')).not.toContain(reference)
        const dashboardPaymentRow = recentTransactions.getByRole('row').filter({ hasText: reference })
        await expect(dashboardPaymentRow).toHaveCount(1)
        const dashboardCells = dashboardPaymentRow.getByRole('cell')
        const dashboardDate = await dashboardCells.nth(0).innerText()
        await expect(dashboardCells.nth(1)).toContainText(`UPI Payment to ${upiId} - ${note}`)
        await expect(dashboardCells.nth(2)).toHaveText(reference)
        await expect(dashboardCells.nth(3)).toHaveText(`-₹${amount}`)
        await expect(dashboardCells.nth(4)).toHaveText('Success')

        // 2. Search Account Statement by generated reference and compare row details.
        await transactionPage.goToTransactionPage()
        await transactionPage.validateTransactionPage()
        const statementRows = transactionPage.transactionTable.getByRole('row')
        const unfilteredRowCount = await statementRows.count()
        await page.getByTestId('searchTransactions').fill(reference)
        await transactionPage.clickOnApplyFilter()

        const statementRow = statementRows.filter({ hasText: reference })
        await expect(statementRow).toHaveCount(1)
        await expect(statementRows).toHaveCount(2)
        const statementCells = statementRow.getByRole('cell')
        await expect(statementCells.nth(0)).toHaveText(dashboardDate)
        await expect(statementCells.nth(1)).toContainText(`UPI Payment to ${upiId} - ${note}`)
        await expect(statementCells.nth(2)).toHaveText(reference)
        await expect(statementCells.nth(3)).toHaveText('debit')
        await expect(statementCells.nth(4)).toHaveText(`-₹${amount}`)
        await expect(statementCells.nth(5)).toHaveText(balanceAfter.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }))
        await expect(statementCells.nth(6)).toHaveText('Success')

        // 3. Clear search and verify the unfiltered statement is restored.
        await page.getByTestId('clearFilters').click()
        await expect(page.getByTestId('searchTransactions')).toHaveValue('')
        await expect(statementRows).toHaveCount(unfilteredRowCount)
        await expect(statementRows.filter({ hasText: reference })).toHaveCount(1)
    })
})
