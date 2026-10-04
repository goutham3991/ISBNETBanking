import { test } from '../../fixtures/pageFixture';

test.describe('Accounts - Dashboard navigation',()=>{
    let openingBalance;
    test.beforeEach('Navigate to the account page and check account Balance',async({page,accountPage})=>{
        await page.goto('/banking/dashboard');   // Account and Dashboard page are same, so navigating to dashboard page
    })
    test('Accounts TC001 - Check opening balance',{tag: '@smoke'},async({accountPage,transfersPage})=>{
        await accountPage.validateAccountPage()
        openingBalance = await accountPage.getAccountBalance()
        console.log(`Opening Balance: ${openingBalance}`);
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
