import { test } from '../../fixtures/pageFixture'

test.describe('Bill Payments - Insurance payment',()=>{
    test.beforeEach('Navigate to Bill Payments page',async ({page})=>{
        await page.goto('/banking/bill-payments')
    })
    test('Bill Payments TC003 - Pay insurance bill',async({payBillsPage})=>{
        let provider = 'Oman Insurance'
        let consumerAccountNum = '123456'
        let enterPaymentAmount = '100'
        await payBillsPage.clickBillType('Insurance')
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
