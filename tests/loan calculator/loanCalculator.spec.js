import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageFixture'

const parseRupees = (value) => Number(value.replace(/[^\d]/g, ''))

test.describe('Loan Calculator - EMI calculations', () => {
    test('Loan Calculator TC001 - Verify EMI calculator bounds, recalculation, units, and amortization', async ({ page, loanCalculator }) => {
        const amountSlider = page.getByTestId('loan-amount-slider')
        const rateSlider = page.getByTestId('interest-rate-slider')
        const tenureSlider = page.getByTestId('tenure-slider')
        const amountDisplay = page.getByTestId('loan-amount-display')
        const rateDisplay = page.getByTestId('interest-rate-display')
        const tenureDisplay = page.getByTestId('tenure-display')
        const monthlyEmi = page.getByTestId('monthly-emi')
        const totalInterest = page.getByTestId('total-interest')
        const totalAmount = page.getByTestId('total-amount')
        const principalAmount = page.getByTestId('principal-amount')
        const amortizationTable = page.getByTestId('amortization-table')
        const scheduleRows = amortizationTable.locator('tbody tr')

        // 1. Open the calculator and verify the default calculator content.
        await page.goto('/banking/loan-calculator')
        await loanCalculator.validateLoanCalculatorPage()
        await expect(page.getByRole('heading', { name: 'EMI Calculator' })).toBeVisible()
        await expect(amountSlider).toBeVisible()
        await expect(rateSlider).toBeVisible()
        await expect(tenureSlider).toBeVisible()
        await expect(page.getByTestId('loan-calc-results')).toBeVisible()
        await expect(page.getByTestId('loan-calc-chart')).toBeVisible()
        await expect(amortizationTable).toBeVisible()
        await expect(page.getByTestId('apply-loan-btn')).toBeVisible()
        await expect(amountSlider).toHaveValue('2500000')
        await expect(rateSlider).toHaveValue('8.5')
        await expect(tenureSlider).toHaveValue('15')
        await expect(tenureDisplay).toHaveText('15 Years')

        // 2. Verify slider bounds and increments exposed by the UI.
        await expect(amountSlider).toHaveAttribute('min', '100000')
        await expect(amountSlider).toHaveAttribute('max', '10000000')
        await expect(amountSlider).toHaveAttribute('step', '50000')
        await expect(rateSlider).toHaveAttribute('min', '6')
        await expect(rateSlider).toHaveAttribute('max', '18')
        await expect(rateSlider).toHaveAttribute('step', '0.25')
        await expect(tenureSlider).toHaveAttribute('min', '1')
        await expect(tenureSlider).toHaveAttribute('max', '30')
        await expect(tenureSlider).toHaveAttribute('step', '1')

        // 3. Move principal to its minimum and maximum using keyboard range controls.
        await amountSlider.focus()
        await amountSlider.press('Home')
        await expect(amountSlider).toHaveValue('100000')
        await expect(amountDisplay).toHaveText('₹1,00,000')
        await expect(principalAmount).toHaveText('₹1,00,000')
        const minimumAmountTotal = parseRupees(await totalAmount.innerText())
        expect(parseRupees(await monthlyEmi.innerText())).toBeGreaterThan(0)

        await amountSlider.press('ArrowRight')
        await expect(amountSlider).toHaveValue('150000')
        await expect(principalAmount).toHaveText('₹1,50,000')
        await amountSlider.press('End')
        await expect(amountSlider).toHaveValue('10000000')
        await expect(amountDisplay).toHaveText('₹1,00,00,000')
        await expect(principalAmount).toHaveText('₹1,00,00,000')
        expect(parseRupees(await totalAmount.innerText())).toBeGreaterThan(minimumAmountTotal)

        // 4. Verify interest-rate changes recalculate cost for a fixed principal and term.
        await amountSlider.focus()
        await amountSlider.press('Home')
        await rateSlider.focus()
        await rateSlider.press('Home')
        await expect(rateSlider).toHaveValue('6')
        await expect(rateDisplay).toHaveText('6%')
        const lowRateTotal = parseRupees(await totalAmount.innerText())
        await rateSlider.press('End')
        await expect(rateSlider).toHaveValue('18')
        await expect(rateDisplay).toHaveText('18%')
        const highRateTotal = parseRupees(await totalAmount.innerText())
        expect(highRateTotal).toBeGreaterThan(lowRateTotal)
        await rateSlider.press('Home')

        // 5. Verify one-year and thirty-year tenure boundaries in Years mode.
        await tenureSlider.focus()
        await tenureSlider.press('Home')
        await expect(tenureSlider).toHaveValue('1')
        await expect(tenureDisplay).toHaveText('1 Year')
        await expect(scheduleRows).toHaveCount(1)
        const oneYearEmi = parseRupees(await monthlyEmi.innerText())
        const oneYearTotal = parseRupees(await totalAmount.innerText())

        await tenureSlider.press('End')
        await expect(tenureSlider).toHaveValue('30')
        await expect(tenureDisplay).toHaveText('30 Years')
        await expect(scheduleRows).toHaveCount(30)
        expect(parseRupees(await monthlyEmi.innerText())).toBeLessThan(oneYearEmi)
        expect(parseRupees(await totalAmount.innerText())).toBeGreaterThan(oneYearTotal)

        // 6. Verify 12, 180, and 360 month values and equivalent Years conversions.
        await tenureSlider.focus()
        await tenureSlider.press('Home')
        for (let stepIndex = 0; stepIndex < 14; stepIndex += 1) {
            await tenureSlider.press('ArrowRight')
        }
        await expect(tenureSlider).toHaveValue('15')
        await expect(tenureDisplay).toHaveText('15 Years')
        const fifteenYearEmi = parseRupees(await monthlyEmi.innerText())
        await page.getByTestId('tenure-months-btn').click()
        await expect(tenureDisplay).toHaveText('180 Months')
        await expect(scheduleRows).toHaveCount(15)
        expect(parseRupees(await monthlyEmi.innerText())).toBe(fifteenYearEmi)

        await tenureSlider.focus()
        await tenureSlider.press('End')
        await expect(tenureSlider).toHaveValue('360')
        await expect(tenureDisplay).toHaveText('360 Months')
        await expect(scheduleRows).toHaveCount(30)

        await tenureSlider.focus()
        await tenureSlider.press('Home')
        await expect(tenureDisplay).toHaveText('12 Months')
        await expect(scheduleRows).toHaveCount(1)
        const twelveMonthEmi = parseRupees(await monthlyEmi.innerText())
        await page.getByTestId('tenure-years-btn').click()
        await expect(tenureDisplay).toHaveText('1 Year')
        expect(parseRupees(await monthlyEmi.innerText())).toBe(twelveMonthEmi)

        // 7. Check summary arithmetic and one-year amortization relationships.
        const principalValue = parseRupees(await principalAmount.innerText())
        const interestValue = parseRupees(await totalInterest.innerText())
        const totalValue = parseRupees(await totalAmount.innerText())
        expect(Math.abs(totalValue - principalValue - interestValue)).toBeLessThanOrEqual(1)

        const firstScheduleRow = scheduleRows.first().getByRole('cell')
        const finalScheduleRow = scheduleRows.last().getByRole('cell')
        await expect(firstScheduleRow.nth(1)).toHaveText(await principalAmount.innerText())
        const scheduledPayment = parseRupees(await firstScheduleRow.nth(2).innerText())
        const scheduledInterest = parseRupees(await firstScheduleRow.nth(3).innerText())
        const scheduledPrincipal = parseRupees(await firstScheduleRow.nth(4).innerText())
        expect(Math.abs(scheduledPayment - scheduledInterest - scheduledPrincipal)).toBeLessThanOrEqual(1)
        await expect(finalScheduleRow.nth(5)).toHaveText('₹0')

        // 8. Apply for Loan is intentionally not activated because exploration showed immediate submission.
    })
})
