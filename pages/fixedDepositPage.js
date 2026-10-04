import { expect } from '@playwright/test'

export class FixedDepositPage {
    constructor(page) {
        this.page = page
        this.fixedDepositMenu = page.getByTestId('bank-nav').filter({ hasText: 'Fixed Deposit' })
        this.pageRoot = page.getByTestId('fixed-deposit-page')
        this.amountInput = page.getByTestId('fdAmount')
        this.submitButton = page.getByTestId('submitFDBtn')
        this.summaryTable = page.getByTestId('fdTable')
        this.summaryHeaders = this.summaryTable.locator('thead th')
        this.fdCards = page.locator('[data-testid^="fdCard-"]')
        this.tenureButtons = {
            '6 Months': page.getByTestId('tenure-6mo'),
            '1 Year': page.getByTestId('tenure-1yr'),
            '2 Years': page.getByTestId('tenure-2yr'),
            '3 Years': page.getByTestId('tenure-3yr'),
            '5 Years': page.getByTestId('tenure-5yr')
        }
    }

    async goToFixedDepositPage() {
        await this.page.goto('/banking/fixed-deposit')
    }

    async validateFixedDepositPage() {
        await this.page.waitForURL('**/banking/fixed-deposit')
        await expect(this.pageRoot).toBeVisible()
    }

    fdCard(index) {
        return this.page.getByTestId(`fdCard-${index}`)
    }

    fdSummaryRow(index) {
        return this.page.getByTestId(`fdRow-${index}`)
    }

    async enterAmount(amount) {
        await this.amountInput.fill(String(amount))
    }

    async selectTenure(tenure) {
        const tenureButton = this.tenureButtons[tenure]
        if (!tenureButton) {
            throw new Error(`Unsupported fixed-deposit tenure: ${tenure}`)
        }
        await tenureButton.click()
    }

    async openFixedDeposit() {
        await expect(this.submitButton).toBeEnabled()
        await this.submitButton.click()
    }
}
