import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Adjust this based on the actual title of the app
    await expect(page).toHaveTitle(/ProjectNexx|Sahibinden/);
});
