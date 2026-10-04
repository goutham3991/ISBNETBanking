import {test} from '../../fixtures/pageFixture'
import { validUser } from '../../test-data/credentials'

test.describe('Login - Authentication',()=>{
    test.beforeEach('Navigate to the login page',async({page,loginPage})=>{
        await page.goto('/banking/login')   
        await loginPage.validateLoginPage()
    })
    test('Login TC001 - Sign in with valid credentials',{tag: '@smoke'},async({dashboardPage,loginPage})=>{
        await loginPage.login(validUser.email,validUser.password)
        await loginPage.waitForDashboardPage()
        await dashboardPage.verifyMenuItems()
        await dashboardPage.validateUserDetails(validUser.username)
        await dashboardPage.checkAccountBalance()
    })
})
