import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import loginData from '../test-data/login.json';

const authFile = 'auth/user.json';

setup('Authentication TC001 - Initialize authenticated storage state', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await page.goto('/banking/login');

    await loginPage.validateLoginPage();

    await loginPage.login(
        loginData.validUser.email,
        loginData.validUser.password
    );

    await expect(page).toHaveURL(/dashboard/);

    await page.context().storageState({
        path: authFile
    });

});
