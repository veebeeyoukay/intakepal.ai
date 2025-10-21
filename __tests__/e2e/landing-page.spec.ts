import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/IntakePal/i);
  });

  test('header contains logo and navigation', async ({ page }) => {
    await expect(page.getByText('IntakePal')).toBeVisible();
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /try demo/i })).toBeVisible();
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.getByText('Meet Allie, your IntakePal')).toBeVisible();
    await expect(page.getByText('The friendliest first step in care')).toBeVisible();
  });

  test('hero features are listed', async ({ page }) => {
    await expect(page.getByText(/no clipboards/i)).toBeVisible();
    await expect(page.getByText(/real-time eligibility/i)).toBeVisible();
    await expect(page.getByText(/EHR write-back/i)).toBeVisible();
    await expect(page.getByText(/Spanish \+ accessibility/i)).toBeVisible();
  });

  test('primary CTA navigates to intake flow', async ({ page }) => {
    await page.getByRole('link', { name: /start florida pilot/i }).click();
    await expect(page).toHaveURL('/new-patient');
  });

  test('secondary CTA scrolls to features section', async ({ page }) => {
    await page.getByRole('link', { name: /see 3-min demo/i }).click();

    // Wait for scroll animation
    await page.waitForTimeout(500);

    // Check if features section is in viewport
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeInViewport();
  });

  test('features section displays all 4 features', async ({ page }) => {
    await expect(page.getByText('No More Clipboards')).toBeVisible();
    await expect(page.getByText('Real-Time Eligibility')).toBeVisible();
    await expect(page.getByText('EHR Write-Back')).toBeVisible();
    await expect(page.getByText('Spanish + Accessibility')).toBeVisible();
  });

  test('trust badges section displays compliance information', async ({ page }) => {
    await expect(page.getByText('HIPAA Compliant')).toBeVisible();
    await expect(page.getByText('End-to-End Encryption')).toBeVisible();
    await expect(page.getByText('WCAG 2.2 AA')).toBeVisible();
    await expect(page.getByText('Audit Trail')).toBeVisible();
  });

  test('contact form is present', async ({ page }) => {
    await expect(page.getByText('Join the Florida Pilot')).toBeVisible();
    await expect(page.getByPlaceholder('Your practice')).toBeVisible();
    await expect(page.getByPlaceholder('admin@practice.com')).toBeVisible();
  });

  test('contact form can be filled and submitted', async ({ page }) => {
    await page.getByPlaceholder('Your practice').fill('Test Medical Center');
    await page.getByPlaceholder('admin@practice.com').fill('admin@test.com');
    await page.getByPlaceholder(/OB-GYN/i).fill('OB-GYN');

    await page.getByRole('button', { name: /request pilot access/i }).click();

    await expect(page.getByText(/Thanks! We'll be in touch/i)).toBeVisible();
  });

  test('footer contains legal links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /terms/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('footer displays copyright and HIPAA notice', async ({ page }) => {
    await expect(page.getByText(/2025 IntakePal/i)).toBeVisible();
    await expect(page.getByText(/HIPAA-compliant/i)).toBeVisible();
    await expect(page.getByText(/BAA-backed/i)).toBeVisible();
  });

  test.describe('Mobile viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('mobile layout renders correctly', async ({ page }) => {
      await expect(page.getByText('Meet Allie, your IntakePal')).toBeVisible();
      await expect(page.getByText(/start florida pilot/i)).toBeVisible();
    });

    test('mobile navigation works', async ({ page }) => {
      const features Link = page.getByRole('link', { name: /features/i });
      await expect(featuresLink).toBeVisible();
    });
  });
});
