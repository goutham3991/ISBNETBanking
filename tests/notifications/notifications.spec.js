import { test } from '../../fixtures/pageFixture';

test.describe('Notifications - Notification categories',()=>{
    test.beforeEach('Navigate to the notifications page',async({page})=>{
        await page.goto('/banking/notifications');   
    })
    test('Notifications TC001 - View All tab',{tag: '@smoke'},async({notificationsPage})=>{
        await notificationsPage.validateNotificationsPage()
        await notificationsPage.goToNotificationTabButton('All')
        await notificationsPage.verifyNotificationsListVisible()
    })
    test('Notifications TC002 - View Transactions tab',{tag: '@smoke'},async({notificationsPage})=>{
        await notificationsPage.validateNotificationsPage()
        await notificationsPage.goToNotificationTabButton('Transactions')
        await notificationsPage.verifyNotificationsListVisible()
    })
    test('Notifications TC003 - View Security tab',{tag: '@smoke'},async({notificationsPage})=>{
        await notificationsPage.validateNotificationsPage()
        await notificationsPage.goToNotificationTabButton('Security')
        await notificationsPage.verifyNotificationsListVisible()
    })
    test('Notifications TC004 - View Offers tab',{tag: '@smoke'},async({notificationsPage})=>{
        await notificationsPage.validateNotificationsPage()
        await notificationsPage.goToNotificationTabButton('Offers')
        await notificationsPage.verifyNotificationsListVisible()
    })
    test('Notifications TC005 - View Reminders tab',{tag: '@smoke'},async({notificationsPage})=>{
        await notificationsPage.validateNotificationsPage()
        await notificationsPage.goToNotificationTabButton('Reminders')
        await notificationsPage.verifyNotificationsListVisible()
    })
})
