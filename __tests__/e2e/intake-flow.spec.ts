import { test, expect } from '@playwright/test';

test.describe('Complete Intake Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/new-patient');
  });

  test('intake wizard loads with step 1 (verify)', async ({ page }) => {
    await expect(page.getByText(/welcome to your secure intake/i)).toBeVisible();
    await expect(page.getByLabel(/mobile number/i)).toBeVisible();
  });

  test('progress bar shows current step', async ({ page }) => {
    const progressBar = page.locator('.h-1.bg-\\[--brand-primary\\]');
    await expect(progressBar).toBeVisible();
  });

  test('language toggle is present and functional', async ({ page }) => {
    const languageToggle = page.getByRole('button', { name: /toggle language/i });
    await expect(languageToggle).toBeVisible();

    // Click to switch to Spanish
    await languageToggle.click();
    await expect(page.getByText(/bienvenido a su admisión segura/i)).toBeVisible();

    // Click back to English
    await languageToggle.click();
    await expect(page.getByText(/welcome to your secure intake/i)).toBeVisible();
  });

  test('complete step 1: phone verification', async ({ page }) => {
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');

    await page.getByRole('button', { name: /continue/i }).click();

    // Should advance to step 2 (consent)
    await expect(page.getByText(/notices & consents/i)).toBeVisible();
  });

  test('step 2: all consents required to proceed', async ({ page }) => {
    // Go to consent step
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    // Try to proceed without consents
    const agreeButton = page.getByRole('button', { name: /i agree/i });
    await expect(agreeButton).toBeDisabled();

    // Check all consents
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    // Should now be enabled
    await expect(agreeButton).toBeEnabled();
  });

  test('complete step 2: consent acceptance', async ({ page }) => {
    // Navigate to consent step
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    // Accept all consents
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }

    await page.getByRole('button', { name: /i agree/i }).click();

    // Should advance to step 3 (coverage)
    await expect(page.getByText(/insurance coverage/i)).toBeVisible();
  });

  test('back button navigates to previous step', async ({ page }) => {
    // Navigate to step 2
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    // Click back
    await page.getByRole('button', { name: /back/i }).first().click();

    // Should be back on step 1
    await expect(page.getByLabel(/mobile number/i)).toBeVisible();
  });

  test('complete step 3: insurance upload', async ({ page }) => {
    // Navigate to coverage step
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: /i agree/i }).click();

    // Upload mock files
    const frontInput = page.locator('#front');
    const backInput = page.locator('#back');

    await frontInput.setInputFiles({
      name: 'insurance-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image'),
    });

    await backInput.setInputFiles({
      name: 'insurance-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image'),
    });

    await page.getByRole('button', { name: /verify coverage/i }).click();

    // Should show loading state
    await expect(page.getByText(/checking/i)).toBeVisible();

    // Should advance to step 4 (history)
    await expect(page.getByText(/medical history/i)).toBeVisible({ timeout: 10000 });
  });

  test('complete step 4: medical history', async ({ page }) => {
    // Navigate to history step (simulate)
    await page.goto('/new-patient');

    // Quick navigation through steps
    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: /i agree/i }).click();

    const frontInput = page.locator('#front');
    const backInput = page.locator('#back');
    await frontInput.setInputFiles({
      name: 'insurance-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image'),
    });
    await backInput.setInputFiles({
      name: 'insurance-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image'),
    });
    await page.getByRole('button', { name: /verify coverage/i }).click();

    await page.waitForTimeout(2000);

    // Fill medical history
    await page.getByLabel(/allergies/i).fill('None');
    await page.getByLabel(/medications/i).fill('Prenatal vitamin');
    await page.getByLabel(/reason/i).fill('Annual checkup');

    await page.getByRole('button', { name: /continue/i }).last().click();

    // Should advance to step 5 (review)
    await expect(page.getByText(/review & submit/i)).toBeVisible();
  });

  test('step 5: review shows all collected data', async ({ page }) => {
    // Navigate to review step (full flow)
    await page.goto('/new-patient');

    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: /i agree/i }).click();

    const frontInput = page.locator('#front');
    const backInput = page.locator('#back');
    await frontInput.setInputFiles({
      name: 'insurance-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image'),
    });
    await backInput.setInputFiles({
      name: 'insurance-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image'),
    });
    await page.getByRole('button', { name: /verify coverage/i }).click();

    await page.waitForTimeout(2000);

    await page.getByLabel(/allergies/i).fill('None');
    await page.getByLabel(/medications/i).fill('Prenatal vitamin');
    await page.getByLabel(/reason/i).fill('Annual checkup');
    await page.getByRole('button', { name: /continue/i }).last().click();

    // Verify review content
    await expect(page.getByText(/Jane Doe \(DEMO\)/i)).toBeVisible();
    await expect(page.getByText(/Blue Cross Blue Shield/i)).toBeVisible();
    await expect(page.getByText(/Annual checkup/i)).toBeVisible();
  });

  test('eligibility alert shows on review step', async ({ page }) => {
    // Complete flow to review step
    await page.goto('/new-patient');

    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: /i agree/i }).click();

    const frontInput = page.locator('#front');
    const backInput = page.locator('#back');
    await frontInput.setInputFiles({
      name: 'insurance-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image'),
    });
    await backInput.setInputFiles({
      name: 'insurance-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image'),
    });
    await page.getByRole('button', { name: /verify coverage/i }).click();

    await page.waitForTimeout(2000);

    await page.getByLabel(/allergies/i).fill('None');
    await page.getByLabel(/medications/i).fill('Prenatal vitamin');
    await page.getByLabel(/reason/i).fill('Annual checkup');
    await page.getByRole('button', { name: /continue/i }).last().click();

    // Check for eligibility alert
    await expect(page.getByText(/coverage active/i)).toBeVisible();
    await expect(page.getByText(/copay/i)).toBeVisible();
  });

  test('demo mode notice is visible', async ({ page }) => {
    await expect(page.getByText(/demo mode/i)).toBeVisible();
  });

  test('final submit calls EHR writeback', async ({ page }) => {
    // Complete entire flow
    await page.goto('/new-patient');

    await page.getByLabel(/mobile number/i).fill('+1-555-0123');
    await page.getByLabel(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /continue/i }).click();

    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).check();
    }
    await page.getByRole('button', { name: /i agree/i }).click();

    const frontInput = page.locator('#front');
    const backInput = page.locator('#back');
    await frontInput.setInputFiles({
      name: 'insurance-front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image'),
    });
    await backInput.setInputFiles({
      name: 'insurance-back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image'),
    });
    await page.getByRole('button', { name: /verify coverage/i }).click();

    await page.waitForTimeout(2000);

    await page.getByLabel(/allergies/i).fill('None');
    await page.getByLabel(/medications/i).fill('Prenatal vitamin');
    await page.getByLabel(/reason/i).fill('Annual checkup');
    await page.getByRole('button', { name: /continue/i }).last().click();

    // Monitor network request
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/mocks/ehr-writeback') && response.status() === 200
    );

    await page.getByRole('button', { name: /submit intake/i }).click();

    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
  });

  test.describe('Spanish language flow', () => {
    test('completes intake in Spanish', async ({ page }) => {
      // Toggle to Spanish
      await page.getByRole('button', { name: /toggle language/i }).click();

      // Verify Spanish text
      await expect(page.getByText(/bienvenido a su admisión segura/i)).toBeVisible();

      // Complete form in Spanish
      await page.getByLabel(/número de móvil/i).fill('+1-555-0123');
      await page.getByLabel(/código de verificación/i).fill('123456');
      await page.getByRole('button', { name: /continuar/i }).click();

      // Should show Spanish consent text
      await expect(page.getByText(/avisos y consentimientos/i)).toBeVisible();
    });
  });
});
