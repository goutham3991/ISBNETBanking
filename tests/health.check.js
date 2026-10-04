import { test, expect } from '@playwright/test';

test('Health check - application is reachable', async ({ request }) => {
    const response = await request.get('/banking/login');
    expect(response.status(), 'Application must be reachable before the suite runs').toBeLessThan(400);
});
