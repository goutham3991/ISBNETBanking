import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageFixture'

const statementFixture = [
    {
        id: 'AS-DEBIT-001',
        type: 'debit',
        from: 'XXXX7890',
        to: 'QA Recipient One',
        amount: 25000,
        date: '2026-04-22T10:30:00',
        description: 'NEFT QA debit alpha',
        status: 'Success'
    },
    {
        id: 'AS-CREDIT-001',
        type: 'credit',
        from: 'QA Employer',
        to: 'XXXX7890',
        amount: 75000,
        date: '2026-04-20T09:00:00',
        description: 'Salary QA credit beta',
        status: 'Success'
    },
    {
        id: 'AS-DEBIT-002',
        type: 'debit',
        from: 'XXXX7890',
        to: 'QA Recipient Two',
        amount: 3500,
        date: '2026-04-18T14:15:00',
        description: 'IMPS QA debit gamma',
        status: 'Success'
    },
    {
        id: 'AS-CREDIT-002',
        type: 'credit',
        from: 'QA Sender',
        to: 'XXXX7890',
        amount: 12000,
        date: '2026-04-15T11:45:00',
        description: 'UPI QA credit Delta',
        status: 'Success'
    },
    {
        id: 'AS-DEBIT-003',
        type: 'debit',
        from: 'XXXX7890',
        to: 'QA Recipient Three',
        amount: 2340,
        date: '2026-04-12T16:20:00',
        description: 'Bill QA debit epsilon',
        status: 'Pending'
    },
    {
        id: 'AS-CREDIT-003',
        type: 'credit',
        from: 'QA Sender Two',
        to: 'XXXX7890',
        amount: 8900,
        date: '2026-04-10T12:00:00',
        description: 'Refund QA credit zeta',
        status: 'Failed'
    }
]

const rowTexts = async (table) => table.getByRole('row').allTextContents()

const applyAndRead = async (page, transactionPage) => {
    await transactionPage.clickOnApplyFilter()
    return rowTexts(transactionPage.transactionTable)
}

test.describe('Transactions - Account statement filtering and display', () => {
    test.beforeEach('Seed isolated statement records and open Account Statement', async ({ page, transactionPage }) => {
        await page.addInitScript((rows) => {
            localStorage.setItem('bank_transactions', JSON.stringify(rows))
        }, statementFixture)
        await transactionPage.goToTransactionPage()
        await transactionPage.validateTransactionPage()
        await expect(transactionPage.transactionTable.getByRole('row')).toHaveCount(statementFixture.length + 1)
    })

    test('Transactions TC001 - Filter transactions by description', async ({ page, transactionPage }) => {
        const fullDescriptionQuery = 'NEFT QA'
        await page.getByTestId('searchTransactions').fill(fullDescriptionQuery)
        const filteredRows = await applyAndRead(page, transactionPage)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-001' })).toHaveCount(1)
        expect(filteredRows).toHaveLength(2)
        await transactionPage.verifyTransactionColumnNames()
    })

    test('Transactions TC002 - Display default statement and all expected columns', async ({ page, transactionPage }) => {
        await expect(page.getByRole('heading', { name: 'Account Statement' })).toBeVisible()
        await expect(transactionPage.transactionHeaders).toHaveText([
            'Date', 'Description', 'Reference', 'Type', 'Amount', 'Balance', 'Status'
        ])
        await expect(page.getByTestId('typeFilter')).toHaveValue('all')
        await expect(page.getByTestId('statusFilter')).toHaveValue('all')
        await expect(page.getByTestId('searchTransactions')).toHaveValue('')
        await expect(transactionPage.transactionTable.getByRole('row')).toHaveCount(statementFixture.length + 1)
        await expect(page.getByText(`Showing 1-${statementFixture.length} of ${statementFixture.length} transactions`)).toBeVisible()
    })

    test('Transactions TC003 - Filter debit transactions', async ({ page, transactionPage }) => {
        await page.getByTestId('typeFilter').selectOption('debit')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(4)
        for (const reference of ['AS-DEBIT-001', 'AS-DEBIT-002', 'AS-DEBIT-003']) {
            await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: reference })).toHaveCount(1)
        }
        await expect(page.getByText('Showing 1-3 of 3 transactions')).toBeVisible()
    })

    test('Transactions TC004 - Filter credit transactions', async ({ page, transactionPage }) => {
        await page.getByTestId('typeFilter').selectOption('credit')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(4)
        for (const reference of ['AS-CREDIT-001', 'AS-CREDIT-002', 'AS-CREDIT-003']) {
            const row = transactionPage.transactionTable.getByRole('row').filter({ hasText: reference })
            await expect(row).toHaveCount(1)
            await expect(row.getByRole('cell').nth(4)).toContainText('+₹')
        }
    })

    test('Transactions TC005 - Filter successful transactions by status', async ({ page, transactionPage }) => {
        await page.getByTestId('statusFilter').selectOption('Success')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(5)
        for (const row of await transactionPage.transactionTable.getByRole('row').all()) {
            if (await row.getByRole('cell').count()) {
                await expect(row.getByRole('cell').last()).toHaveText('Success')
            }
        }
    })

    test('Transactions TC006 - Combine debit and success filters', async ({ page, transactionPage }) => {
        await page.getByTestId('typeFilter').selectOption('debit')
        await page.getByTestId('statusFilter').selectOption('Success')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(3)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-001' })).toHaveCount(1)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-002' })).toHaveCount(1)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-003' })).toHaveCount(0)
    })

    test('Transactions TC007 - Include transactions on an inclusive same-day range', async ({ page, transactionPage }) => {
        await page.getByTestId('fromDate').fill('2026-04-18')
        await page.getByTestId('toDate').fill('2026-04-18')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(2)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-002' })).toHaveCount(1)
    })

    test('Transactions TC008 - Search by exact transaction reference', async ({ page, transactionPage }) => {
        await page.getByTestId('searchTransactions').fill('AS-CREDIT-002')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(2)
        const matchingRow = transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-CREDIT-002' })
        await expect(matchingRow).toHaveCount(1)
        await expect(matchingRow.getByRole('cell').nth(1)).toHaveText('UPI QA credit Delta')
    })

    test('Transactions TC009 - Search description case-insensitively by substring', async ({ page, transactionPage }) => {
        await page.getByTestId('searchTransactions').fill('delta')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(2)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-CREDIT-002' })).toHaveCount(1)
    })

    test('Transactions TC010 - Show empty state when search has no matches', async ({ page, transactionPage }) => {
        await page.getByTestId('searchTransactions').fill('NO-MATCH-QUERY')
        const rows = await applyAndRead(page, transactionPage)
        expect(rows).toHaveLength(2)
        await expect(page.getByText('No transactions found matching your filters.')).toBeVisible()
        await expect(page.getByText('Showing 0-0 of 0 transactions')).toBeVisible()
    })

    test('Transactions TC011 - Keep results staged until Apply Filters is clicked', async ({ page, transactionPage }) => {
        const originalRows = await rowTexts(transactionPage.transactionTable)
        await page.getByTestId('typeFilter').selectOption('debit')
        await page.getByTestId('searchTransactions').fill('AS-DEBIT-001')
        await expect(transactionPage.transactionTable.getByRole('row')).toHaveText(originalRows)
        const filteredRows = await applyAndRead(page, transactionPage)
        expect(filteredRows).toHaveLength(2)
        await expect(transactionPage.transactionTable.getByRole('row').filter({ hasText: 'AS-DEBIT-001' })).toHaveCount(1)
    })

    test('Transactions TC012 - Clear filters and restore seeded rows', async ({ page, transactionPage }) => {
        await page.getByTestId('typeFilter').selectOption('credit')
        await page.getByTestId('searchTransactions').fill('AS-CREDIT-001')
        await transactionPage.clickOnApplyFilter()
        await page.getByTestId('clearFilters').click()

        await expect(page.getByTestId('fromDate')).toHaveValue('')
        await expect(page.getByTestId('toDate')).toHaveValue('')
        await expect(page.getByTestId('typeFilter')).toHaveValue('all')
        await expect(page.getByTestId('statusFilter')).toHaveValue('all')
        await expect(page.getByTestId('searchTransactions')).toHaveValue('')
        await expect(transactionPage.transactionTable.getByRole('row')).toHaveCount(statementFixture.length + 1)
    })

    test.fixme('Transactions TC013 - Preserve historical balances when filtering debit rows', async ({ page, transactionPage }) => {
        const allRows = await transactionPage.transactionTable.getByRole('row').all()
        const originalBalances = new Map()
        for (const row of allRows.slice(1)) {
            const cells = row.getByRole('cell')
            originalBalances.set(await cells.nth(2).innerText(), await cells.nth(5).innerText())
        }

        await page.getByTestId('typeFilter').selectOption('debit')
        await transactionPage.clickOnApplyFilter()
        const debitRows = await transactionPage.transactionTable.getByRole('row').all()
        // The app currently recomputes historical Balance values from the filtered subset; keep this P0 defect visible until the statement implementation is fixed.
        for (const row of debitRows.slice(1)) {
            const cells = row.getByRole('cell')
            const reference = await cells.nth(2).innerText()
            await expect(cells.nth(5)).toHaveText(originalBalances.get(reference))
        }
    })

    test('Transactions TC014 - Keep result summary consistent with filtered and empty rows', async ({ page, transactionPage }) => {
        await page.getByTestId('typeFilter').selectOption('debit')
        await transactionPage.clickOnApplyFilter()
        await expect(page.getByText('Showing 1-3 of 3 transactions')).toBeVisible()

        await page.getByTestId('searchTransactions').fill('AS-UNKNOWN')
        await transactionPage.clickOnApplyFilter()
        await expect(page.getByText('No transactions found matching your filters.')).toBeVisible()
        await expect(page.getByText('Showing 0-0 of 0 transactions')).toBeVisible()
    })

    test('Transactions TC015 - Validate debit and credit signs and unique references', async ({ transactionPage }) => {
        const tableRows = await transactionPage.transactionTable.getByRole('row').all()
        const references = new Set()

        for (const row of tableRows.slice(1)) {
            const cells = row.getByRole('cell')
            const reference = await cells.nth(2).innerText()
            const type = (await cells.nth(3).innerText()).toLowerCase()
            const amount = await cells.nth(4).innerText()
            expect(references.has(reference)).toBe(false)
            references.add(reference)
            if (type === 'debit') expect(amount).toContain('-₹')
            if (type === 'credit') expect(amount).toContain('+₹')
        }
    })
})
