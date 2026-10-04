import { test } from '../../fixtures/pageFixture'

test.describe('Bill Payments - Internet and broadband payment',()=>{
    test.beforeEach('Navigate to Bill Payments page',async ({page})=>{
        await page.goto('/banking/bill-payments')
    })
    test('Bill Payments TC004 - Pay Internet or Broadband bill',async({payBillsPage})=>{
        let provider = 'du Home Internet'
        let consumerAccountNum = '123456'
        let enterPaymentAmount = '100'
        await payBillsPage.clickBillType('Internet/Broadband')
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
