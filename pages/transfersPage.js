import { expect } from '@playwright/test'

export class TransfersPage {
    constructor(page){
        this.page = page
        this.continueButton = page.getByRole('button', { name: 'Continue' })
        this.addBeneficiaryLinkOption = page.getByTestId('addNewBene')
        this.addBeneficiaryButton = page.getByTestId('addBeneficiaryBtn')
        this.addBeneficiaryForm = page.getByTestId('addBeneModal')   
        this.enterTransferDetailsHeading =  page.getByText('Enter Transfer Details')
        this.transferAmount = page.getByTestId('transferAmount')
        this.remarks = page.getByTestId('remarks')
        this.confirmAndSendOTP = page.getByTestId('confirmTransferBtn')
        this.checkTransactionType = page.getByTestId('review-transferType')
        this.checkTransactionAmount = page.getByTestId('review-amount')
        this.checkTransactionRemarks = page.getByTestId('review-remarks')
        this.verifyAndTransferButton = page.getByText('Verify & Transfer')
        this.transactionSuccessMsg = page.getByText('Transfer Successful!')
        this.goToDashboard = page.getByText('Go to Dashboard')

    }

    async goToTransfersPage() {
        await this.page.goto('/banking/transfer')
    }

    async validateTransfersPage() {
        await this.page.waitForURL('**/banking/transfer')
    }

    async selectTransactionType(transactionType) {
        const transactionTypeLocator = this.page.getByTestId(`type-${transactionType}`);
        await transactionTypeLocator.click();
    }

    async clickContinueButton() {
        await this.continueButton.click()
    }

    async clickAddBeneficiaryLink(){
        await this.addBeneficiaryLinkOption.click()
    }

    async validateBeneficiaryPage() {
        await this.page.waitForURL('**/banking/beneficiary')
    }

    async clickAddBeneficiaryButton() {
        await this.addBeneficiaryButton.click()
    }

    async verifyAddBeneficiaryFormVisible() {
        await expect(this.addBeneficiaryForm).toBeVisible()
    }

    async fillAddBeneficiaryForm(accountHolderName, accountNumber, ifscCode, nickname) {
        await this.addBeneficiaryForm.getByRole('textbox', { name: 'Name' }).first().fill(accountHolderName)
        await this.addBeneficiaryForm.getByRole('textbox', { name: 'Account Number' }).first().fill(accountNumber)
        await this.addBeneficiaryForm.getByRole('textbox', { name: 'Confirm Account No.' }).first().fill(accountNumber)
        await this.addBeneficiaryForm.getByRole('textbox', { name: 'IFSC Code' }).first().fill(ifscCode)
        await this.addBeneficiaryForm.getByRole('textbox', { name: 'Nickname' }).first().fill(nickname)
        await this.addBeneficiaryForm.getByRole('button', { name: 'Add Beneficiary' }).click()
    }

    async verifySuccessMessage(expectedMessage) {
        await expect(this.page.getByTestId('beneSuccessMsg')).toContainText(expectedMessage)
    }

    async deleteBeneficiary(accountHolderName) {
        await this.page.locator('[data-testid^="beneCard"] h3').filter({ hasText: accountHolderName })
            .locator('..').getByRole('button', { name: 'Delete' }).click()

        await this.page.getByTestId('deleteConfirmModal').getByRole('button', { name: 'Delete' }).click()
    }

    async selectBeneficiary(index = 0) {
        const beneficiaries = this.page.locator('[data-testid^="bene-BEN"]');     
        const count = await beneficiaries.count();     
        if (count === 0) {
          throw new Error('No beneficiaries available');
        }      
        if (index >= count) {
          throw new Error(`Beneficiary index ${index} out of range (found ${count})`);
        }
        await beneficiaries.nth(index).click();
        await this.continueButton.click();
        await expect(this.enterTransferDetailsHeading).toBeVisible()
    }

    async enterTransferDetails(amount,remarks){
        await this.transferAmount.fill(amount)
        await this.remarks.fill(remarks)
        await this.continueButton.click()
    }

    async confirmTransactionDetails(
        expectedTransactionType,
        expectedTransactionAmount,
        expectedTransactionRemarks
      ) {
        await expect(this.checkTransactionType)
          .toHaveText(expectedTransactionType);
      
                const displayedAmount = (await this.checkTransactionAmount.innerText()).replace(/[^\d]/g, '')
                const expectedAmount = String(expectedTransactionAmount).replace(/[^\d]/g, '')
                expect(displayedAmount).toBe(expectedAmount)
      
        await expect(this.checkTransactionRemarks)
          .toHaveText(expectedTransactionRemarks);
      }

    async clickOnContinueAndSendOTP(){
        await this.confirmAndSendOTP.click()
    }

    async enterOTP(otp) {
        const otpInputs = this.page.locator('[data-testid^="otpBox-"]');
        for (let i = 0; i < otp.length; i++) {
          await otpInputs.nth(i).fill(otp[i]);
        }
    }

    async clickOnVerifyAndTransferButton(){
        this.verifyAndTransferButton.click()
    }

    async verifyTransactionSuccessMessage(){
        await expect(this.transactionSuccessMsg).toBeVisible()
    }

    async goToDashboardButton(){
        await this.goToDashboard.click()
    }
}