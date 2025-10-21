# IntakePal Demo Application

A production-ready landing page and demo workflow for **IntakePal** — the friendliest first step in care. This application showcases AI-native patient intake via voice, text, and web with real-time eligibility verification and EHR write-back.

## What's Included

### Landing Page
- **Hero Section**: Meet Allie, your IntakePal with clear CTAs
- **Features Grid**: 4 key value propositions (no clipboards, real-time eligibility, EHR write-back, Spanish + accessibility)
- **Trust Badges**: HIPAA, WCAG 2.2 AA, BAA-compliant, audit trail
- **Contact Form**: Pilot signup form with success state

### Demo Intake Flow (`/new-patient`)
A complete 5-step patient intake wizard:
1. **Verify**: OTP-style identity verification (mock)
2. **Consent**: 4 consent checkboxes (HIPAA NPP, consent to treat, financial responsibility, TCPA)
3. **Coverage**: Insurance card upload placeholders (front/back) with mock OCR
4. **History**: Medical history questionnaire (allergies, medications, reason for visit)
5. **Review**: Summary with eligibility status banner and patient/insurance details

### Mock API Endpoints
- `POST /api/mocks/eligibility` — Returns mock eligibility data (active status, copay, deductible)
- `POST /api/mocks/ehr-writeback` — Simulates FHIR resource creation and logs to console

### Content Files
Located in `/content`:
- `ivr-script.md` — Voice prompts with emergency handling and consent flows
- `sms-templates.json` — Non-PHI SMS message templates (magic links, reminders, TCPA compliance)
- `email-templates.json` — Email templates (magic links, confirmations, consent documents)
- `anomaly-rules.json` — v1 anomaly detection rules (insurance inactive, duplicate patient, etc.)
- `seed-data.json` — Sample patients, coverages, pharmacies, and questionnaires
- `spanish-copy.json` — Spanish translations for hero and intake steps

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with design tokens from brand guide
- **Components**: shadcn/ui (Button, Card, Input, Checkbox, Alert, Badge, Label)
- **Icons**: lucide-react
- **Animation**: Framer Motion (150-250ms transitions, respects `prefers-reduced-motion`)
- **Fonts**: Inter (via Google Fonts)

## Design Tokens

Defined in `app/globals.css` and `lib/constants.ts`:

```css
--brand-primary: #0EA5A0  /* Primary actions, highlights */
--brand-accent: #7C3AED   /* Accents, links, chips */
--ink: #0F172A            /* Primary text on light */
--muted-ink: #475569      /* Secondary text */
--surface: #FFFFFF        /* Background */
--surface-alt: #F8FAFC    /* Cards, sections */
--success: #0EA5A0        /* Success states */
--warning: #F59E0B        /* Caution banners */
--danger: #DC2626         /* Errors */
```

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Running the Dev Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the landing page.

Navigate to [http://localhost:3001/new-patient](http://localhost:3001/new-patient) to try the demo intake flow.

## Building for Production

```bash
npm run build
npm run start
```

## Customizing Theme Tokens

To customize the brand colors and typography:

1. **Colors**: Edit `app/globals.css` and update the CSS variables under `:root`
2. **Typography**: Change the font import in `app/globals.css` and update `tailwind.config.ts`
3. **Logo**: Replace `/public/intakepal-logo.svg` with your own logo
4. **Copy**: Edit constants in `lib/constants.ts` to change hero text, consent labels, etc.

## Demo Data & Privacy

**Important**: This application uses mock data only. No real PHI is transmitted or stored.

- All sample patients are marked with "(DEMO)" in their names
- Mock API endpoints log to console and return deterministic data
- SMS/email templates contain no PHI (magic links only)
- Insurance cards are file upload placeholders (files are not actually sent anywhere)

## Accessibility

This application is built to WCAG 2.2 AA standards:

- ✓ 4.5:1 contrast ratio for text
- ✓ Keyboard navigation support
- ✓ Visible focus states
- ✓ aria-labels on interactive elements
- ✓ Spanish language toggle
- ✓ Respects `prefers-reduced-motion`

## File Structure

```
/app
  /api/mocks
    /eligibility/route.ts       # Mock eligibility endpoint
    /ehr-writeback/route.ts     # Mock EHR write-back endpoint
  /new-patient/page.tsx          # Intake flow
  globals.css                    # Global styles + design tokens
  layout.tsx                     # Root layout
  page.tsx                       # Landing page
/components
  /ui                            # shadcn/ui components
    button.tsx
    card.tsx
    input.tsx
    checkbox.tsx
    label.tsx
    alert.tsx
    badge.tsx
  Hero.tsx                       # Landing page hero
  Features.tsx                   # Features grid
  TrustBadges.tsx                # Trust badges
  ContactForm.tsx                # Pilot signup form
/content
  ivr-script.md                  # Voice/IVR scripts
  sms-templates.json             # SMS templates
  email-templates.json           # Email templates
  anomaly-rules.json             # Anomaly detection rules
  seed-data.json                 # Sample data
  spanish-copy.json              # Spanish translations
/lib
  utils.ts                       # Utility functions
  constants.ts                   # Design tokens + brand copy
/public
  intakepal-logo.svg             # IntakePal logo
```

## Brand Voice: Allie

**Tone**: Warm > Clear > Brief > Reassuring > Respectful

**Personality**: Friendly, clear, calm, competent (BFF → concierge, not a robot)

**Microcopy Patterns**:
- **Affirm**: "Got it—let's do this in a couple of quick steps."
- **Choice**: "Would you like a link to your phone, or we can keep going here?"
- **Consent**: "I'll read a brief notice. Say 'I agree' when you're ready."
- **Error**: "Hmm, that didn't go through. Let's try again."

## Compliance Notes

- **HIPAA**: No PHI in SMS/WhatsApp; PHI only in secure web app; mock BAA with vendors
- **TCPA**: Explicit opt-in for SMS/voice; STOP/HELP keywords supported in templates
- **Audit**: Every consent, access, and write is logged (check console in demo)

## Next Steps

### For Development
1. Connect real EHR APIs (Athenahealth FHIR, eClinicalWorks, NextGen)
2. Integrate X12 270/271 via clearinghouse (e.g., Change Healthcare, Availity)
3. Add Twilio for voice/SMS (BAA-compliant)
4. Implement Supabase for database, auth, and storage
5. Add OCR service for insurance card extraction (e.g., AWS Textract, Google Vision)

### For Customization
1. Update brand colors and logo in `app/globals.css` and `/public/intakepal-logo.svg`
2. Customize consent text in `lib/constants.ts`
3. Add/modify questionnaire items in `content/seed-data.json`
4. Translate additional UI strings to Spanish in `content/spanish-copy.json`

## Support

For questions or issues with this demo:
- Review the brand guide: `brand_styleguide.md`
- Review the technical spec: `AI_NewPatient_Onboarding_Tech_Spec.md`
- Review the executive summary: `Executive_OnePager_AI_NewPatient_Onboarding.md`

---

**Built with care by AllieBuilder** | IntakePal — The friendliest first step in care.
