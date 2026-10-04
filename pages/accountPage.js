import { expect } from '@playwright/test'

export class AccountPage {
    constructor(page) {
        this.page = page
        this.accountMenu = page.getByTestId('bank-nav').filter({ hasText: 'Accounts' })
        this.quickActions = page.getByTestId('quickActions')
        this.quickPayViaUPISection = page.getByTestId('quick-pay-card')
        this.enterUPIId = page.getByTestId('upi-id-input')
        this.enterAmount = page.getByTestId('upi-amount-input')
        this.enterNotes= page.getByTestId('upi-note-input')
        this.payNowButton = page.getByRole('button',{name:'Pay Now'})
    }

    async validateAccountPage(){
        await this.page.waitForURL('https://www.testerrank.com/banking/dashboard') // Account and Dashboard page are same, so navigating to dashboard page
    }

    async getAccountBalance() {
        const balanceText = await this.page
        .getByTestId('accBal1')
        .textContent(); 
        const balance = Number(
            balanceText.replace(/[₹,]/g, '').trim()
        );
        console.log(`Account Balance: ${balance}`);
        return balance;
    }

    async clickQuickAction(actionName) {
        const actionLocator = this.quickActions.getByText(actionName);
        await actionLocator.click();
        console.log(`Navigated to ${actionName} page.`);
    }

    async verifyUpiQuickPaySection(){
        await expect(this.quickPayViaUPISection).toBeVisible()
    }

    async enterUPI(upiID){
        await this.enterUPIId.fill(upiID)
    }

    async enterUPIAmount(upiAmount){
        await this.enterAmount.fill(upiAmount)
    }

    async enterUPINotes(upiNotes){
        await this.enterNotes.fill(upiNotes)
    }

    async clickPayNow(){
        await this.payNowButton.click()
    }

}