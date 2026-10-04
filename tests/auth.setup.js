import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { validUser } from '../test-data/credentials';

const authFile = 'auth/user.json';


setup('Authentication TC001 - Initialize authenticated storage state', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await page.goto('/banking/login');

    await loginPage.validateLoginPage();

    await loginPage.login(
        validUser.email,
        validUser.password
    );

    await expect(page).toHaveURL(/dashboard/);

    await page.context().storageState({
        path: authFile
    });

});
