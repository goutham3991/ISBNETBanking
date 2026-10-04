import { test, expect } from '../../fixtures/pageFixture';

test.describe('Accounts - Dashboard navigation',()=>{
    test.beforeEach('Navigate to the account page and check account Balance',async({page})=>{
        await page.goto('/banking/dashboard');   // Account and Dashboard page are same, so navigating to dashboard page
    })
    test('Accounts TC001 - Check opening balance',{tag: '@smoke'},async({accountPage})=>{
        await accountPage.validateAccountPage()
        const openingBalance = await accountPage.getAccountBalance()
        expect(openingBalance).toBeGreaterThanOrEqual(0)
    })
    test('Accounts TC002 - Navigate to Fund Transfer from quick actions',{tag: '@smoke'},async({accountPage,transfersPage})=>{
        await accountPage.clickQuickAction('Fund Transfer')
        await transfersPage.validateTransfersPage()
    })
    test('Accounts TC003 - Navigate to Pay Bills from quick actions',{tag: '@smoke'},async({accountPage,payBillsPage})=>{
        await accountPage.clickQuickAction('Pay Bills')
        await payBillsPage.validatePayBillsPage()
    })
    test('Accounts TC004 - Navigate to Fixed Deposit from quick actions',{tag: '@smoke'},async({accountPage,fixedDeposit})=>{
        await accountPage.clickQuickAction('Fixed Deposit')
        await fixedDeposit.validateFixedDepositPage()
    })
    test('Accounts TC005 - Navigate to Loan Calculator from quick actions',{tag: '@smoke'},async({accountPage,loanCalculator})=>{
        await accountPage.clickQuickAction('Loan Calculator')
        await loanCalculator.validateLoanCalculatorPage()
    })
})
