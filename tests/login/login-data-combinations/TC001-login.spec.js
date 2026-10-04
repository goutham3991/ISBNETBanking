import {test,expect} from '@playwright/test'
import { validUser } from '../../../test-data/credentials'

test.describe('Login - Credential data combinations',()=>{
        const loginUsers = [
            {
                get username() { return validUser.email },
                get password() { return validUser.password },
                expectedResult: 'success'
            },
            {
                username: 'rahul123@netbank.com',
                password: 'Bank@123123',
                expectedResult: 'failure'
            },
            {
                get username() { return validUser.email },
                password: 'Bank@123123',
                expectedResult: 'failure'
            },
            {
                username: 'rahul1234@netbank.com',
                get password() { return validUser.password },
                expectedResult: 'failure'
            }
        ]
        loginUsers.forEach((user,index)=>{
            const caseNumber = String(index + 2).padStart(3, '0')
            test(`Login TC${caseNumber} - Verify ${user.expectedResult} credential combination`, async ({ page }) => {
                await page.goto('/banking/login')
                await page.getByTestId('userId').fill(user.username)
                await page.getByTestId('password').fill(user.password)
                await page.getByText('Sign In').nth(1).click()
                if (user.expectedResult === 'success') {
                    await expect(page.locator('#bankHeader h1'))
                      .toContainText('Welcome');            
                  } else {         
                    const errorMessage = page.getByText('Invalid User ID or Password. Please try again.')     
                    await expect(errorMessage).toBeVisible()           
                  }
            })
        })
})
