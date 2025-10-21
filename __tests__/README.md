# IntakePal Testing Suite

Comprehensive testing infrastructure for the IntakePal HIPAA-compliant patient intake application.

## Test Coverage

- ✅ **Unit Tests** - Components and utilities
- ✅ **Integration Tests** - API routes and data flows
- ✅ **E2E Tests** - Complete user journeys
- ✅ **Accessibility Tests** - WCAG 2.2 AA compliance
- ✅ **HIPAA Compliance Tests** - PHI protection and channel rules
- ✅ **Localization Tests** - English/Spanish
- ✅ **Medical Domain Tests** - Consent flows and anomaly detection

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm run test:all
```

### Run Specific Test Suites

```bash
# Unit and integration tests
npm run test

# E2E tests
npm run test:e2e

# With coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
npm run test:e2e:ui
```

## Test Structure

```
__tests__/
├── unit/                  # Unit tests
│   ├── components/        # React component tests
│   └── lib/               # Utility function tests
├── integration/           # Integration tests
│   └── api/               # API route tests
├── e2e/                   # End-to-end tests
│   ├── landing-page.spec.ts
│   └── intake-flow.spec.ts
├── accessibility/         # WCAG 2.2 AA tests
│   └── wcag.spec.ts
├── hipaa/                 # HIPAA compliance tests
│   ├── phi-protection.test.ts
│   ├── channel-rules.test.ts
│   └── consent-medical.test.ts
└── fixtures/              # Test data
    ├── demo-patients.json
    └── test-responses.json
```

## Coverage Requirements

Minimum coverage thresholds (enforced by CI/CD):

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 75%
- **Statements**: 80%

## Test Categories

### 1. Unit Tests (`__tests__/unit/`)

Test individual components and functions in isolation.

**Components tested:**
- Hero.tsx - Landing page hero section
- Features.tsx - Feature grid display
- TrustBadges.tsx - Compliance badges
- ContactForm.tsx - Pilot signup form

**Run:**
```bash
npx vitest run __tests__/unit
```

### 2. Integration Tests (`__tests__/integration/`)

Test API endpoints and data flows.

**APIs tested:**
- `/api/mocks/eligibility` - Insurance eligibility check
- `/api/mocks/ehr-writeback` - FHIR resource creation

**Run:**
```bash
npx vitest run __tests__/integration
```

### 3. E2E Tests (`__tests__/e2e/`)

Test complete user flows using Playwright.

**Flows tested:**
- Landing page navigation
- Complete intake wizard (5 steps)
- Spanish language toggle
- Form validation
- File uploads
- API integration

**Run:**
```bash
npm run test:e2e
```

**Debug mode:**
```bash
npm run test:e2e:ui
```

### 4. Accessibility Tests (`__tests__/accessibility/`)

Automated WCAG 2.2 AA compliance testing using axe-core.

**Checks:**
- Color contrast (4.5:1 for text, 3:1 for large text)
- Keyboard navigation
- Screen reader support (ARIA labels, alt text)
- Form accessibility
- Heading hierarchy
- Landmark regions
- Motion preferences (prefers-reduced-motion)

**Run:**
```bash
npx playwright test __tests__/accessibility
```

### 5. HIPAA Compliance Tests (`__tests__/hipaa/`)

Critical security and compliance testing.

**PHI Protection Tests:**
- No PHI in console logs without DEMO marker
- No PHI in localStorage/sessionStorage
- No PHI in URL parameters
- File uploads stay local in demo mode
- Demo data clearly marked

**Channel Rules Tests:**
- SMS templates contain no PHI
- Email templates minimize PHI
- WhatsApp messages contain no PHI
- Magic links are secure (HTTPS, expiring)
- Voice recordings have retention policy

**Medical Domain Tests:**
- All 4 consents required (HIPAA, Treatment, Financial, TCPA)
- Consent evidence captured (timestamp, mode, IP/call SID)
- Anomaly rules never block submission
- Questionnaire validation
- Coverage eligibility structure

**Run:**
```bash
npx vitest run __tests__/hipaa
```

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '@/components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test('describes the test', async ({ page }) => {
  await page.goto('/your-page');
  await expect(page.getByText('Expected Text')).toBeVisible();
});
```

### Accessibility Test Template

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/your-page');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request

GitHub Actions workflow: `.github/workflows/ci.yml`

**Jobs:**
1. Unit & Integration Tests
2. E2E Tests (Playwright)
3. Accessibility Tests
4. HIPAA Compliance Tests
5. Lint (ESLint)
6. Build
7. Security Scan (npm audit)

## Known Test Issues

None currently. All tests passing as of latest commit.

## Debugging Tests

### Vitest (Unit/Integration)

```bash
# Run in watch mode
npm run test

# Run specific test file
npx vitest run __tests__/unit/components/Hero.test.tsx

# Debug with UI
npm run test:ui
```

### Playwright (E2E/Accessibility)

```bash
# Run with UI mode (shows browser)
npx playwright test --ui

# Run specific test
npx playwright test __tests__/e2e/landing-page.spec.ts

# Debug mode (step through tests)
npx playwright test --debug

# View last test report
npm run test:e2e:report
```

## Test Data

Demo data is located in `__tests__/fixtures/`:

- `demo-patients.json` - Mock patient records
- `test-responses.json` - Mock API responses

**IMPORTANT**: All test data is clearly marked with `(DEMO)` suffix to comply with HIPAA requirements.

## Accessibility Testing Tools

- **axe-core** - Automated WCAG testing
- **Playwright** - Browser automation for manual checks
- **Chrome DevTools** - Lighthouse accessibility audit

## HIPAA Testing Checklist

Before deploying to production:

- [ ] All PHI logs have `[DEMO]` marker
- [ ] SMS templates contain no PHI
- [ ] Magic links use HTTPS and expire
- [ ] File uploads don't transmit to external services
- [ ] All consents are required and evidence is captured
- [ ] Anomalies route to staff but don't block patients
- [ ] BAA agreements signed with all vendors

## Performance Testing

(Not yet implemented - planned for Phase 2)

- Load testing with k6
- API response time monitoring
- Bundle size optimization

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass locally
3. Verify coverage stays above 80%
4. Check accessibility with axe-core
5. Review HIPAA compliance impact
6. Update this README if needed

## Support

For issues or questions:
- Check existing test failures in GitHub Actions
- Review test output for specific error messages
- Consult WCAG 2.2 guidelines for accessibility issues
- Reference HIPAA tech spec for compliance requirements

---

**Test Coverage Goal**: >80% across all code
**Current Coverage**: (Run `npm run test:coverage` to check)
**Last Updated**: 2025-10-21
