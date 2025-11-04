import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
    const LOGIN_URL = '/admin/login';
    const ADMIN_URL = '/admin';

    test('should allow a user to log in successfully', async ({ page }) => {
        await page.goto(LOGIN_URL);

        // GUNAKAN KREDENSIAL YANG BENAR
        await page.getByLabel('Email').fill('vicotriansyahnasril@gmail.com');
        await page.getByLabel('Password').fill('V1c0123');

        await page.getByRole('button', { name: 'Login' }).click();

        await page.waitForURL(ADMIN_URL);
        await expect(page).toHaveURL(ADMIN_URL);
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('should show an error message with wrong credentials', async ({ page }) => {
        await page.goto(LOGIN_URL);

        await page.getByLabel('Email').fill('vicotriansyahnasril@gmail.com');
        await page.getByLabel('Password').fill('wrongpassword'); // Biarkan ini salah untuk menguji skenario gagal

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login gagal. Periksa kembali email dan password Anda.')).toBeVisible();
        await expect(page).toHaveURL(LOGIN_URL);
    });
});