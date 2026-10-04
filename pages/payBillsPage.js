import { expect } from '@playwright/test'

export class PayBillsPage {
    constructor(page) {
        this.page = page
        this.payBillsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Pay Bills' })
        this.paymentBillSection = page.getByTestId('billPayForm')
    }
    async validatePayBillsPage() {
        await this.page.waitForURL('https://www.testerrank.com/banking/bill-payments')
    }

    async clickBillType(billType){
        await this.page.getByRole('button',{name: billType }).click()
    }

    async validatePaymentSection(){
        await expect(this.paymentBillSection).toBeVisible()
    }

    async selectProvided(provider){
        const providerBiller = this.paymentBillSection.getByLabel('Provider / Biller')
        await expect(providerBiller).toBeVisible()
        await providerBiller.selectOption(provider)
    }

    async customerAccountNumber(consumerAccountNum){
        const consumerAccountNumber = this.paymentBillSection.getByLabel('Consumer / Account Number')
        await expect(consumerAccountNumber).toBeVisible()
        await consumerAccountNumber.fill(consumerAccountNum)
    }

    async enterPaymentAmount(enterPaymentAmount){
        const amount = this.paymentBillSection.getByLabel('Amount')
        await expect(amount).toBeVisible()
        const enterAmount = amount.locator('..').getByTestId('billAmount')
        await enterAmount.clear()
        await enterAmount.fill(enterPaymentAmount)
    }

    async validateCustomerAccountNumber(){
        const fromAccount = this.paymentBillSection.getByTestId('bill-from-account')
        await expect(fromAccount).toBeVisible()
    }

    async clickOnPayBillButton(){
        const payNowButton = this.page.getByRole('button',{name:'Pay Now'})
        await payNowButton.click()
    }

    async validatePaymentSuccessMessageWithAmountAndProviderDetails(enterPaymentAmount,provider){
        await expect(this.page.getByText('Payment Successful')).toBeVisible()
        const confirmationMessage = this.page.getByTestId('billSuccessMsg').locator('p')
        await expect(confirmationMessage).toContainText(
            `Payment of ₹${enterPaymentAmount} to ${provider} successful. Ref:`
          );
    }

    async validateTransactionDetailsInRecentPayment(){
        const successMessage = await this.page
        .locator('p.text-sm')
        .first()
        .textContent();
    
        const splitTransactionID = successMessage.split('Ref: ');   
        const transactionID = splitTransactionID[1]
        console.log('Transaction ID is: '+ transactionID)

        const checkTransactionDetails = 
        this.page.getByTestId('bill-payments-page').locator('[class^="mt"]').locator('[data-testid^="billCard"]').getByText(transactionID)
        await expect(checkTransactionDetails).toBeVisible()
    }
}