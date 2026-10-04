import { expect } from '@playwright/test'

export class NotificationsPage {
    constructor(page){
        this.page = page
        this.notificationsMenu = page.getByTestId('bank-nav').filter({ hasText: 'Notifications' })
        this.notificationPageFilters = page.locator('[data-testid^="filter-"]')
    }

    async validateNotificationsPage(){
        await this.page.waitForURL('https://www.testerrank.com/banking/notifications')
    }

    async goToNotificationTabButton(tabName){
        const tabLocator = this.page.getByRole('Button', { name: tabName }).last();
        await tabLocator.click();
    }

    async verifyNotificationsListVisible(){
        const notifications =  await this.page.locator('[data-testid^="notification-NOTIF"]').count();
        if (notifications === 0) {
            console.log('No notifications found for the selected tab.');
        } else {
            expect(notifications).toBeGreaterThan(0);
            console.log(`Number of notifications found: ${notifications}`);
        }     
    }
}