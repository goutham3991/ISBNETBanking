import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageFixture'

const seededFixedDeposits = [
    { id: 'QA-FD-ACTIVE', amount: 50000, tenure: '2 Years', interestRate: 6.75, maturityAmount: 57166.38, startDate: '2025-01-01', maturityDate: '2027-01-01', status: 'Active' },
    { id: 'QA-FD-MATURED', amount: 25000, tenure: '1 Year', interestRate: 6.5, maturityAmount: 26660.16, startDate: '2024-01-01', maturityDate: '2025-01-01', status: 'Matured' },
    { id: 'QA-FD-LONG', amount: 100000, tenure: '5 Years', interestRate: 7.25, maturityAmount: 142950.35, startDate: '2025-08-20', maturityDate: '2030-08-20', status: 'Active' }
]

const tenureLabels = ['6 Months', '1 Year', '2 Years', '3 Years', '5 Years']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatRupees = (amount) => `₹${amount.toLocaleString('en-IN')}`
const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-')
    return `${day}-${monthNames[Number(month) - 1]}-${year}`
}
const readStoredBalance = async (page) => page.evaluate(() => {
    const currentUser = JSON.parse(localStorage.getItem('bank_currentUser') || '{}')
    return Number(currentUser.balance)
})

test.describe('Fixed Deposit - P0 and P2 scenarios', () => {
    test.beforeEach('Seed isolated FD and source balance state', async ({ page, fixedDeposit }) => {
        await page.addInitScript(({ deposits, balance }) => {
            localStorage.setItem('bank_fixedDeposits', JSON.stringify(deposits))
            const currentUser = JSON.parse(localStorage.getItem('bank_currentUser') || '{}')
            currentUser.balance = balance
            localStorage.setItem('bank_currentUser', JSON.stringify(currentUser))
        }, { deposits: seededFixedDeposits, balance: 100000 })
        await fixedDeposit.goToFixedDepositPage()
        await fixedDeposit.validateFixedDepositPage()
        await expect(fixedDeposit.summaryTable.getByRole('row')).toHaveCount(seededFixedDeposits.length + 1)
    })

    test('Fixed Deposit TC001 - Load FD overview and summary', async ({ page, fixedDeposit }) => {
        await expect(page.getByRole('heading', { name: 'Your Fixed Deposits' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Open New Fixed Deposit' })).toBeVisible()
        await expect(fixedDeposit.fdCards).toHaveCount(seededFixedDeposits.length)
        await expect(fixedDeposit.summaryTable.getByRole('row')).toHaveCount(seededFixedDeposits.length + 1)
        await expect(fixedDeposit.summaryHeaders).toHaveText([
            'ID', 'Amount', 'Rate', 'Tenure', 'Start', 'Maturity', 'Status'
        ])
    })

    test('Fixed Deposit TC002 - Reconcile displayed FD card details with summary', async ({ fixedDeposit }) => {
        for (let index = 0; index < seededFixedDeposits.length; index += 1) {
            const expected = seededFixedDeposits[index]
            const card = fixedDeposit.fdCard(index)
            const row = fixedDeposit.fdSummaryRow(index)
            const startDate = formatDate(expected.startDate)
            const maturityDate = formatDate(expected.maturityDate)

            await expect(card).toContainText(expected.id)
            await expect(card).toContainText(formatRupees(expected.amount))
            await expect(card).toContainText(`${expected.interestRate}% p.a.`)
            await expect(card).toContainText(expected.tenure)
            await expect(card).toContainText(`${startDate} → ${maturityDate}`)
            await expect(card).toContainText(expected.status)
            await expect(row.getByTestId(`fdNo-${index}`)).toHaveText(expected.id)
            await expect(row.getByTestId(`fdAmt-${index}`)).toHaveText(formatRupees(expected.amount))
            await expect(row.getByTestId(`fdRate-${index}`)).toContainText(String(expected.interestRate))
            await expect(row.getByTestId(`fdTenure-${index}`)).toHaveText(expected.tenure)
            await expect(row.getByTestId(`fdMaturity-${index}`)).toHaveText(maturityDate)
            await expect(row.getByTestId(`fdStatus-${index}`)).toHaveText(expected.status)
        }
    })

    test('Fixed Deposit TC003 - Open a minimum-principal FD for every available tenure', async ({ page, fixedDeposit }) => {
        const principal = 10000
        const openingBalance = await readStoredBalance(page)

        for (let tenureIndex = 0; tenureIndex < tenureLabels.length; tenureIndex += 1) {
            const tenure = tenureLabels[tenureIndex]
            await fixedDeposit.enterAmount(principal)
            await fixedDeposit.selectTenure(tenure)
            await fixedDeposit.openFixedDeposit()

            const expectedRecordCount = seededFixedDeposits.length + tenureIndex + 1
            await expect(fixedDeposit.summaryTable.getByRole('row')).toHaveCount(expectedRecordCount + 1)
            const openedRows = fixedDeposit.summaryTable.getByRole('row')
                .filter({ hasText: formatRupees(principal) })
                .filter({ hasText: tenure })
            await expect(openedRows).toHaveCount(1)
            await expect(fixedDeposit.fdCards).toHaveCount(expectedRecordCount)
            expect(await readStoredBalance(page)).toBe(openingBalance - principal * (tenureIndex + 1))
        }
    })

    test('Fixed Deposit TC004 - Enable opening for principal just above the minimum', async ({ fixedDeposit }) => {
        await fixedDeposit.enterAmount('10001')
        await fixedDeposit.selectTenure('1 Year')
        await expect(fixedDeposit.submitButton).toBeEnabled()
        await expect(fixedDeposit.amountInput).toHaveValue('10001')
    })

    test('Fixed Deposit TC005 - Probe oversized principal without submitting', async ({ page, fixedDeposit }) => {
        const rowCount = await fixedDeposit.summaryTable.getByRole('row').count()
        const balanceBefore = await readStoredBalance(page)
        const largeAmount = '999999999999'
        await fixedDeposit.enterAmount(largeAmount)
        await fixedDeposit.selectTenure('5 Years')
        await expect(fixedDeposit.amountInput).toHaveValue(largeAmount)
        await expect(fixedDeposit.summaryTable.getByRole('row')).toHaveCount(rowCount)
        expect(await readStoredBalance(page)).toBe(balanceBefore)
    })

    test('Fixed Deposit TC006 - Switch between tenure options without changing principal', async ({ fixedDeposit }) => {
        await fixedDeposit.enterAmount('10000')
        for (const tenure of tenureLabels) {
            const selected = fixedDeposit.tenureButtons[tenure]
            await fixedDeposit.selectTenure(tenure)
            await expect(selected).toHaveClass(/bg-\[#002D62\]/)
            await expect(fixedDeposit.submitButton).toBeEnabled()
            await expect(fixedDeposit.amountInput).toHaveValue('10000')
        }
    })

    test('Fixed Deposit TC007 - Keep elapsed progress within 0 to 100 percent', async ({ fixedDeposit }) => {
        for (let index = 0; index < seededFixedDeposits.length; index += 1) {
            const cardText = await fixedDeposit.fdCard(index).innerText()
            const elapsed = cardText.match(/(\d+)% elapsed/)
            expect(elapsed, `FD card ${index} should show elapsed progress`).toBeTruthy()
            expect(Number(elapsed[1])).toBeGreaterThanOrEqual(0)
            expect(Number(elapsed[1])).toBeLessThanOrEqual(100)
            if (seededFixedDeposits[index].status === 'Matured') {
                expect(Number(elapsed[1])).toBe(100)
            }
        }
    })

    test('Fixed Deposit TC008 - Prevent duplicate FD creation on a rapid repeated submit', async ({ page, fixedDeposit }) => {
        const principal = 10000
        const rowsBefore = await fixedDeposit.summaryTable.getByRole('row').count()
        const balanceBefore = await readStoredBalance(page)
        await fixedDeposit.enterAmount(principal)
        await fixedDeposit.selectTenure('6 Months')
        await expect(fixedDeposit.submitButton).toBeEnabled()
        await fixedDeposit.submitButton.dblclick()
        await expect(fixedDeposit.summaryTable.getByRole('row')).toHaveCount(rowsBefore + 1)
        expect(await readStoredBalance(page)).toBe(balanceBefore - principal)
    })
})
