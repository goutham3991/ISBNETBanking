import { expect } from '@playwright/test'

export class DashboardPage {
    constructor(page){
        this.page = page
        this.dashboardMenu = page.getByTestId('bank-nav').filter({ hasText: 'Dashboard' })
        this.notificationsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Notifications' })
        this.accountsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Accounts' })
        this.fundTransferMenu = page.getByTestId('bank-nav').filter({ hasText: 'Fund Transfer' })
        this.transactionsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Transactions' })
        this.beneficiariesMenu = page.getByTestId('bank-nav').filter({ hasText: 'Beneficiaries' })
        this.billPaymentsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Bill Payments' })
        this.fixedDepositsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Fixed Deposits' })
        this.loanCalculatorMenu = page.getByTestId('bank-nav').filter({ hasText: 'Loan Calculator' })
        this.cardsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Cards' })
        this.profileAndSettingsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Profile & Settings' })
        this.logoutButton = page.getByTestId('logoutBtn')        
    }

    async verifyMenuItems() {
        await expect(this.dashboardMenu).toBeVisible()
        await expect(this.notificationsMenu).toBeVisible()
        await expect(this.accountsMenu).toBeVisible()
        await expect(this.fundTransferMenu).toBeVisible()
        await expect(this.transactionsMenu).toBeVisible()
        await expect(this.beneficiariesMenu).toBeVisible()
        await expect(this.billPaymentsMenu).toBeVisible()
        await expect(this.fixedDepositsMenu).toBeVisible()
        await expect(this.loanCalculatorMenu).toBeVisible()
        await expect(this.cardsMenu).toBeVisible()
        await expect(this.profileAndSettingsMenu).toBeVisible()
        console.log('All menu items are visible on the dashboard page.')
    }

    async validateUserDetails(username){
        await expect(this.page.getByText(`Welcome, ${username}`)).toBeVisible()
    }

    async checkAccountBalance(){
        const accBalance = await this.page.getByTestId('accBal1').textContent()
        console.log(`Account Balance: ${accBalance}`)
    }

    async navigateToFundTransferPage(){
        await this.page.getByText('Fund Transfer').first().click()
        await this.page.waitForURL('https://www.testerrank.com/banking/transfer')
    }

    async navigateToNotificationsPage(){
        await this.page.getByText('Notifications').first().click()
        await this.page.waitForURL('https://www.testerrank.com/banking/notifications')
    }
}