import {test,expect} from '@playwright/test'

test.describe('Login - Credential data combinations',()=>{
        const loginUsers = [
            {
                username: 'rahul@netbank.com',
                password: 'Bank@123',
                expectedResult: 'success'
            },
            {
                username: 'rahul123@netbank.com',
                password: 'Bank@123123',
                expectedResult: 'failure'
            },
            {
                username: 'rahul@netbank.com',
                password: 'Bank@123123',
                expectedResult: 'failure'
            },
            {
                username: 'rahul1234@netbank.com',
                password: 'Bank@123',
                expectedResult: 'failure'
            }
        ]
        loginUsers.forEach((user,index)=>{
            const caseNumber = String(index + 2).padStart(3, '0')
            test(`Login TC${caseNumber} - Verify ${user.expectedResult} credential combination`, async ({ page }) => {
                await page.goto('https://www.testerrank.com/banking/login')
                await page.getByTestId('userId').fill(user.username)
                await page.getByTestId('password').fill(user.password)
                await page.getByText('Sign In').nth(1).click()
                if (user.expectedResult === 'success') {
                    await expect(page.locator('#bankHeader h1'))
                      .toContainText('Welcome');            
                    console.log('Login Successful');             
                  } else {         
                    const errorMessage = page.getByText('Invalid User ID or Password. Please try again.')     
                    await expect(errorMessage).toBeVisible()           
                    console.log('Login Failed as expected');            
                  }
            })
        })
})
