import {expect} from '@playwright/test'

export class LoginPage {
    constructor(page) {
        this.page = page
        this.usernameInput = page.getByTestId('userId')
        this.passwordInput = page.getByTestId('password')
        this.loginButton = page.getByTestId('loginBtn')
        
    }

    async login(username, password) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async waitForDashboardPage(){
        await this.page.waitForURL('**/banking/dashboard')
    }

    async validateLoginPage(){
        const signInToYourAccountPage = this.page.getByText('Sign In to Your Account')
        await expect(signInToYourAccountPage).toBeVisible()
    }

    async verifyInvalidLoginErrorMsg(){
        const invalidLoginError = this.page.getByText('Invalid User ID or Password. Please try again.')
        await expect(invalidLoginError).toBeVisible()
    }
}