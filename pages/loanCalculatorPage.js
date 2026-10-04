import { expect } from '@playwright/test'

export class LoanCalculatorPage {
    constructor(page){
        this.page = page
        this.loanCalculatorMenu = page.getByTestId('bank-nav').filter({ hasText: 'Loan Calculator' })
    }

    async validateLoanCalculatorPage(){
        await this.page.waitForURL('https://www.testerrank.com/banking/loan-calculator')
    }
}