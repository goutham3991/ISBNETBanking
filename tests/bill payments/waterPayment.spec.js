import { test } from '../../fixtures/pageFixture'

test.describe('Bill Payments - Water payment',()=>{
    test.beforeEach('Navigate to Bill Payments page',async ({page})=>{
        await page.goto('/banking/bill-payments')
    })
    test('Bill Payments TC006 - Pay water bill',async({payBillsPage})=>{
        let provider = 'SEWA Water - Sharjah'
        let consumerAccountNum = '123456'
        let enterPaymentAmount = '100'
        await payBillsPage.clickBillType('Water')
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
