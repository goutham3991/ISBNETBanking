import {test as base, expect} from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { LoginPage } from '../pages/loginPage';
import { TransfersPage } from '../pages/transfersPage';
import { NotificationsPage } from '../pages/notificationPage';
import { AccountPage } from '../pages/accountPage';
import { PayBillsPage } from '../pages/payBillsPage';
import { FixedDepositPage } from '../pages/fixedDepositPage';
import { LoanCalculatorPage } from '../pages/loanCalculatorPage';
import { TransactionPage } from '../pages/transactionsPage';

export const test = base.extend({
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    transfersPage: async ({ page }, use) => {
        const transfersPage = new TransfersPage(page);
        await use(transfersPage);
    },
    notificationsPage: async ({ page }, use) => {
        const notificationsPage = new NotificationsPage(page);
        await use(notificationsPage);
    },
    accountPage: async ({ page }, use) => {
        const accountPage = new AccountPage(page);
        await use(accountPage);
    },
    payBillsPage: async ({ page }, use) => {
        const payBillsPage = new PayBillsPage(page);
        await use(payBillsPage);
    },
    fixedDeposit: async ({page}, use)=>{
        const fixedDepositPage = new FixedDepositPage(page);
        await use(fixedDepositPage)
    },
    loanCalculator: async ({page}, use)=>{
        const loanCalculatorPage = new LoanCalculatorPage(page);
        await use(loanCalculatorPage)
    },
    transactionPage: async({page}, use)=>{
        const transactionPage = new TransactionPage(page);
        await use(transactionPage)
    }
});

export { expect };
