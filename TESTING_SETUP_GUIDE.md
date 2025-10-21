# Testing Setup Guide

Quick start guide for running the IntakePal test suite.

## Prerequisites

- Node.js 20+
- npm or yarn

## Installation

The testing dependencies are currently installing. Once complete, you'll have:

- ✅ Vitest (unit & integration testing)
- ✅ React Testing Library
- ✅ Playwright (E2E testing)
- ✅ @axe-core/playwright (accessibility testing)
- ✅ MSW (API mocking)

## First Time Setup

### 1. Wait for Dependencies to Finish Installing

The `npm install` command for testing dependencies is currently running in the background. Check status with:

```bash
# This should show vitest, playwright, etc. installed
npm list vitest playwright @testing-library/react
```

### 2. Install Playwright Browsers

Once npm install completes, run:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for E2E testing.

### 3. Verify Installation

```bash
# Check Vitest
npx vitest --version

# Check Playwright
npx playwright --version
```

## Running Tests

### All Tests

```bash
npm run test:all
```

### Unit & Integration Tests Only

```bash
npm run test
```

### E2E Tests Only

```bash
npm run test:e2e
```

### With Coverage Report

```bash
npm run test:coverage
```

### Interactive UI

```bash
# Vitest UI (unit tests)
npm run test:ui

# Playwright UI (E2E tests)
npm run test:e2e:ui
```

## Test Structure

```
__tests__/
├── unit/                    # Component & utility tests
│   ├── components/          # Hero, Features, TrustBadges, ContactForm
│   └── lib/                 # Constants, utilities
├── integration/             # API route tests
│   └── api/                 # Eligibility, EHR writeback
├── e2e/                     # End-to-end flows
│   ├── landing-page.spec.ts
│   └── intake-flow.spec.ts
├── accessibility/           # WCAG 2.2 AA compliance
│   └── wcag.spec.ts
├── hipaa/                   # HIPAA compliance
│   ├── phi-protection.test.ts
│   ├── channel-rules.test.ts
│   └── consent-medical.test.ts
└── fixtures/                # Test data
    ├── demo-patients.json
    └── test-responses.json
```

## Debugging Tests

### Vitest (Unit/Integration)

```bash
# Run in watch mode (auto-reruns on file changes)
npm run test

# Run specific test file
npx vitest run __tests__/unit/components/Hero.test.tsx

# Debug with UI
npm run test:ui
```

### Playwright (E2E)

```bash
# Run with browser visible
npx playwright test --headed

# Run in UI mode (interactive)
npm run test:e2e:ui

# Debug mode (step through tests)
npx playwright test --debug

# Run specific test
npx playwright test __tests__/e2e/landing-page.spec.ts

# View last test report
npm run test:e2e:report
```

## Understanding Test Results

### Successful Run

```
✓ __tests__/unit/components/Hero.test.tsx (8 tests)
✓ __tests__/integration/api/eligibility.test.ts (12 tests)
...

Test Files  13 passed (13)
Tests  150 passed (150)
```

### Failed Test

```
❌ __tests__/unit/components/Hero.test.tsx > renders correctly
Expected: "Meet Allie, your IntakePal."
Received: undefined
```

**Action**: Fix the issue in the component and re-run tests.

### Coverage Report

After running `npm run test:coverage`, open:

```
coverage/index.html
```

This shows line-by-line coverage visualization.

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests

View results in GitHub Actions:
`.github/workflows/ci.yml`

## Common Issues

### Issue: Playwright browsers not installed

**Error**: `browserType.launch: Executable doesn't exist at...`

**Fix**:
```bash
npx playwright install
```

### Issue: Port 3000 already in use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Fix**:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run tests on different port
PORT=3001 npm run test:e2e
```

### Issue: Tests timeout

**Fix**: Increase timeout in test files or config:

```ts
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

## Next Steps

1. ✅ Review `TEST_RESULTS_AND_BUG_REPORT.md` for identified issues
2. ✅ Fix critical bugs (BUG-001, BUG-002)
3. ✅ Run tests to verify fixes
4. ✅ Achieve 85%+ coverage before production
5. ✅ Set up CI/CD pipeline (already configured)

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [axe-core Accessibility Testing](https://www.deque.com/axe/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## Support

Questions? Check:
- `__tests__/README.md` - Detailed testing guide
- `TEST_RESULTS_AND_BUG_REPORT.md` - Bug report with fixes
- Test output logs for specific error messages

---

Happy Testing! 🧪
