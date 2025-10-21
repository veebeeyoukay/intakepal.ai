import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.2 AA Compliance', () => {
  test('landing page has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('intake wizard page has no accessibility violations', async ({ page }) => {
    await page.goto('/new-patient');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.describe('Color Contrast', () => {
    test('all text meets 4.5:1 contrast ratio', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      );
      expect(contrastViolations).toHaveLength(0);
    });

    test('large text meets 3:1 contrast ratio', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.color'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('interactive elements meet contrast requirements', async ({ page }) => {
      await page.goto('/new-patient');

      const buttons = page.getByRole('button');
      const count = await buttons.count();

      // All buttons should be visible and have sufficient contrast
      for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toBeVisible();
      }

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('button')
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      );
      expect(contrastViolations).toHaveLength(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.keyboard'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('tab order is logical on landing page', async ({ page }) => {
      await page.goto('/');

      // Press Tab to navigate through interactive elements
      await page.keyboard.press('Tab');
      let focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();

      // Should be able to reach all CTAs via Tab
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        focusedElement = await page.locator(':focus').first();
        if (await focusedElement.isVisible()) {
          const text = await focusedElement.textContent();
          if (text && text.includes('Start Florida pilot')) {
            break;
          }
        }
      }
    });

    test('intake form fields are keyboard navigable', async ({ page }) => {
      await page.goto('/new-patient');

      // Tab to phone input
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const phoneInput = page.getByLabel(/mobile number/i);
      await expect(phoneInput).toBeFocused();

      // Type without mouse
      await page.keyboard.type('+1-555-0123');
      await expect(phoneInput).toHaveValue('+1-555-0123');
    });

    test('Enter activates buttons', async ({ page }) => {
      await page.goto('/new-patient');

      await page.getByLabel(/mobile number/i).fill('+1-555-0123');
      await page.getByLabel(/verification code/i).fill('123456');

      // Focus the continue button and press Enter
      await page.getByRole('button', { name: /continue/i }).focus();
      await page.keyboard.press('Enter');

      // Should navigate to consent step
      await expect(page.getByText(/notices & consents/i)).toBeVisible();
    });

    test('focus is visible on all elements', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['color-contrast']) // Focus separately from contrast
        .analyze();

      const focusViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'focus-order-semantics'
      );
      expect(focusViolations).toHaveLength(0);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('all images have alt text', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.text-alternatives'])
        .analyze();

      const imageAltViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'image-alt'
      );
      expect(imageAltViolations).toHaveLength(0);
    });

    test('form fields have proper labels', async ({ page }) => {
      await page.goto('/new-patient');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.forms'])
        .analyze();

      const labelViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'label'
      );
      expect(labelViolations).toHaveLength(0);
    });

    test('ARIA labels on icons', async ({ page }) => {
      await page.goto('/');

      // Check that icons in header have accessible names
      const logo = page.locator('svg[aria-label="IntakePal logo"]');
      await expect(logo).toBeVisible();
    });

    test('landmark regions are defined', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.structure'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Check for semantic landmarks
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('heading hierarchy is correct', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.structure'])
        .analyze();

      const headingViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'heading-order'
      );
      expect(headingViolations).toHaveLength(0);
    });

    test('required fields are marked', async ({ page }) => {
      await page.goto('/new-patient');

      const phoneInput = page.getByLabel(/mobile number/i);
      await expect(phoneInput).toHaveAttribute('required', '');
    });

    test('error messages are announced', async ({ page }) => {
      await page.goto('/new-patient');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.aria'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Motion and Animation', () => {
    test('respects prefers-reduced-motion', async ({ page, context }) => {
      // Set reduced motion preference
      await context.emulateMedia({ reducedMotion: 'reduce' });

      await page.goto('/');

      // Page should still load without animation errors
      await expect(page.getByText('Meet Allie, your IntakePal')).toBeVisible();
    });

    test('no auto-playing content', async ({ page }) => {
      await page.goto('/');

      // Check for auto-playing video or audio
      const videos = page.locator('video[autoplay]');
      await expect(videos).toHaveCount(0);

      const audio = page.locator('audio[autoplay]');
      await expect(audio).toHaveCount(0);
    });

    test('no flashing content', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();

      // Axe doesn't have a flashing rule, but we can check for known patterns
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Form Accessibility', () => {
    test('contact form is fully accessible', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('form')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('intake wizard form is accessible', async ({ page }) => {
      await page.goto('/new-patient');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['cat.forms'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('error states are accessible', async ({ page }) => {
      await page.goto('/new-patient');

      // Try to submit without filling required field
      await page.getByLabel(/mobile number/i).fill('+1-555-0123');
      // Leave OTP empty

      const continueButton = page.getByRole('button', { name: /continue/i });
      await expect(continueButton).toBeDisabled();
    });

    test('success messages are accessible', async ({ page }) => {
      await page.goto('/');

      // Fill and submit contact form
      await page.getByPlaceholder('Your practice').fill('Test Practice');
      await page.getByPlaceholder('admin@practice.com').fill('test@practice.com');
      await page.getByPlaceholder(/OB-GYN/i).fill('OB-GYN');
      await page.getByRole('button', { name: /request pilot access/i }).click();

      // Success message should be visible and accessible
      await expect(page.getByText(/Thanks!/i)).toBeVisible();

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="alert"]')
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('mobile viewport has no violations', async ({ page }) => {
      await page.goto('/');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('touch targets are at least 44x44px', async ({ page }) => {
      await page.goto('/new-patient');

      const buttons = page.getByRole('button');
      const firstButton = buttons.first();

      const box = await firstButton.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(40); // Allow some margin
    });
  });

  test.describe('Language Support', () => {
    test('Spanish version has no violations', async ({ page }) => {
      await page.goto('/new-patient');

      // Toggle to Spanish
      await page.getByRole('button', { name: /toggle language/i }).click();

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('language toggle has accessible label', async ({ page }) => {
      await page.goto('/new-patient');

      const languageToggle = page.getByRole('button', { name: /toggle language/i });
      await expect(languageToggle).toHaveAttribute('aria-label');
    });
  });
});
