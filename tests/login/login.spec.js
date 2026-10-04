import {test,expect} from '../../fixtures/pageFixture'
import loginData from '../../test-data/login.json'

test.describe('Login - Authentication',()=>{
    test.beforeEach('Navigate to the login page',async({page,loginPage})=>{
        await page.goto('/banking/login')   
        await loginPage.validateLoginPage()
    })
    test('Login TC001 - Sign in with valid credentials',{tag: '@smoke'},async({dashboardPage,loginPage})=>{
        await loginPage.login(loginData.validUser.email,loginData.validUser.password)
        await loginPage.waitForDashboardPage()
        await dashboardPage.verifyMenuItems()
        await dashboardPage.validateUserDetails(loginData.validUser.username)
        await dashboardPage.checkAccountBalance()
    })
})
