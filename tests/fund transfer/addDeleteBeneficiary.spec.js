import { test } from '../../fixtures/pageFixture';
import beneficiaryData from '../../test-data/addBeneficiaryAccount.json';

test.describe('Beneficiary - Fund transfer beneficiary management',()=>{
    // Tests share one beneficiary record, so they must not run in parallel
    test.describe.configure({ mode: 'serial' });
    test.beforeEach('Navigate to the fund transfer page', async ({ page, dashboardPage }) => {
        await page.goto('/banking/dashboard'); 
        await dashboardPage.navigateToFundTransferPage();  
    });
    test('Beneficiary TC001 - Add and delete NEFT beneficiary',{tag: '@regression'},async({transfersPage})=>{
        await transfersPage.selectTransactionType(beneficiaryData.transactionDetails.NEFTtransactionType)
        await transfersPage.clickContinueButton()
        await transfersPage.clickAddBeneficiaryLink()
        await transfersPage.validateBeneficiaryPage()
        await transfersPage.clickAddBeneficiaryButton()
        await transfersPage.verifyAddBeneficiaryFormVisible()
        await transfersPage.fillAddBeneficiaryForm(
            beneficiaryData.accountDetails.accountHolderName,
            beneficiaryData.accountDetails.accountNumber,
            beneficiaryData.accountDetails.ifscCode,
            beneficiaryData.accountDetails.nickname)
        await transfersPage.verifySuccessMessage('added successfully')
        await transfersPage.deleteBeneficiary(beneficiaryData.accountDetails.accountHolderName)
    })
    test('Beneficiary TC002 - Add and delete IMPS beneficiary',{tag: '@regression'},async({transfersPage})=>{
        await transfersPage.selectTransactionType(beneficiaryData.transactionDetails.IMPStransactionType)
        await transfersPage.clickContinueButton()
        await transfersPage.clickAddBeneficiaryLink()
        await transfersPage.validateBeneficiaryPage()
        await transfersPage.clickAddBeneficiaryButton()
        await transfersPage.verifyAddBeneficiaryFormVisible()
        await transfersPage.fillAddBeneficiaryForm(
            beneficiaryData.accountDetails.accountHolderName,
            beneficiaryData.accountDetails.accountNumber,
            beneficiaryData.accountDetails.ifscCode,
            beneficiaryData.accountDetails.nickname)
        await transfersPage.verifySuccessMessage('added successfully')
        await transfersPage.deleteBeneficiary(beneficiaryData.accountDetails.accountHolderName)
    })
    test('Beneficiary TC003 - Add and delete RTGS beneficiary',{tag: '@regression'},async({transfersPage})=>{
        await transfersPage.selectTransactionType(beneficiaryData.transactionDetails.RTGStransactionType)
        await transfersPage.clickContinueButton()
        await transfersPage.clickAddBeneficiaryLink()
        await transfersPage.validateBeneficiaryPage()
        await transfersPage.clickAddBeneficiaryButton()
        await transfersPage.verifyAddBeneficiaryFormVisible()
        await transfersPage.fillAddBeneficiaryForm(
            beneficiaryData.accountDetails.accountHolderName,
            beneficiaryData.accountDetails.accountNumber,
            beneficiaryData.accountDetails.ifscCode,
            beneficiaryData.accountDetails.nickname)
        await transfersPage.verifySuccessMessage('added successfully')
        await transfersPage.deleteBeneficiary(beneficiaryData.accountDetails.accountHolderName)
    })
})
