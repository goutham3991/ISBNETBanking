import { test } from '../../fixtures/pageFixture'
import { expect } from '@playwright/test'
import beneficiaryData from '../../test-data/addBeneficiaryAccount.json'

test.describe('Fund Transfer - Transfer workflows', () => {
    test.describe.configure({ mode: 'serial' })
    let openingBalance
    let latestBalance

    test.beforeEach('Navigate to the fund transfer page', async ({ page, dashboardPage, accountPage }) => {
        await page.goto('/banking/dashboard')
        await accountPage.validateAccountPage()
        openingBalance = await accountPage.getAccountBalance()
        await dashboardPage.navigateToFundTransferPage()
    })

    test('Fund Transfer TC001 - Complete IMPS transfer', async ({ page, transfersPage, accountPage }) => {
        const transferAmount = '15'
        const remarks = 'Borrowed Amount'
        const otp = '123456'

        await transfersPage.selectTransactionType(beneficiaryData.transactionDetails.IMPStransactionType)
        await transfersPage.clickContinueButton()
        await transfersPage.selectBeneficiary()
        await transfersPage.enterTransferDetails(transferAmount, remarks)
        await transfersPage.confirmTransactionDetails('IMPS', transferAmount, remarks)
        await transfersPage.clickOnContinueAndSendOTP()
        await transfersPage.enterOTP(otp)
        await transfersPage.clickOnVerifyAndTransferButton()
        await transfersPage.verifyTransactionSuccessMessage()
        await transfersPage.goToDashboardButton()
        await page.goto('/banking/dashboard')
        await accountPage.validateAccountPage()
        latestBalance = await accountPage.getAccountBalance()
        expect(latestBalance).toBe(openingBalance - Number(transferAmount))
    })

    test('Fund Transfer TC002 - Complete NEFT transfer', async ({ page, transfersPage, accountPage }) => {
        const transferAmount = '10'
        const remarks = 'Borrowed Amount'
        const otp = '123456'

        await transfersPage.selectTransactionType(beneficiaryData.transactionDetails.NEFTtransactionType)
        await transfersPage.clickContinueButton()
        await transfersPage.selectBeneficiary()
        await transfersPage.enterTransferDetails(transferAmount, remarks)
        await transfersPage.confirmTransactionDetails('NEFT', transferAmount, remarks)
        await transfersPage.clickOnContinueAndSendOTP()
        await transfersPage.enterOTP(otp)
        await transfersPage.clickOnVerifyAndTransferButton()
        await transfersPage.verifyTransactionSuccessMessage()
        await transfersPage.goToDashboardButton()
        await page.goto('/banking/dashboard')
        await accountPage.validateAccountPage()
        latestBalance = await accountPage.getAccountBalance()
        expect(latestBalance).toBe(openingBalance - Number(transferAmount))
    })
})
