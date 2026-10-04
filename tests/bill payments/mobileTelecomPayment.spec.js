import { test } from '../../fixtures/pageFixture'

test.describe('Bill Payments - Mobile and telecom payment',()=>{
    test.beforeEach('Navigate to Bill Payments page',async ({page})=>{
        await page.goto('/banking/bill-payments')
    })
    test('Bill Payments TC005 - Pay Mobile or Telecom bill',async({payBillsPage})=>{
        let provider = 'Etisalat Prepaid'
        let consumerAccountNum = '123456'
        let enterPaymentAmount = '100'
        await payBillsPage.clickBillType('Mobile/Telecom')
        await payBillsPage.validatePaymentSection()
        await payBillsPage.selectProvided(provider)
        await payBillsPage.customerAccountNumber(consumerAccountNum)
        await payBillsPage.enterPaymentAmount(enterPaymentAmount)
        await payBillsPage.validateCustomerAccountNumber()
        await payBillsPage.clickOnPayBillButton()
        await payBillsPage.validatePaymentSuccessMessageWithAmountAndProviderDetails(enterPaymentAmount,provider)
        await payBillsPage.validateTransactionDetailsInRecentPayment()
    })
})
