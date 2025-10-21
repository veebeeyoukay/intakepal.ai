# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**IntakePal** is an AI-native, HIPAA-compliant patient intake system with omnichannel support (voice, web, SMS, WhatsApp). The AI agent **Allie** guides patients through new-patient onboarding, collecting demographics, insurance, consents, and medical history, then writes back to EHR systems.

**Target**: Multi-specialty practices (starting with OB-GYN and Podiatry in Florida)
**Key Features**: Voice IVR replacement, real-time insurance eligibility (X12 270/271), AI OCR for insurance cards, EHR integration (FHIR R4), white-label branding

## Tech Stack

- **Frontend**: React + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Auth, DB, Storage, Edge Functions)
- **Communications**: Twilio (Voice, SMS with BAA)
- **Integrations**:
  - EHR: Athenahealth, eClinicalWorks, NextGen (FHIR R4)
  - RCM: X12 270/271 via clearinghouse
  - Pharmacy: NCPDP lookup
  - Optional: Surescripts, eFax, HIE/TEFCA (Phase 2+)

## Architecture

```
Patient (Voice/SMS/Web) → Twilio/Magic-link
                       ↓
                Secure Web App (PWA)
                       ↓
          Supabase Edge Orchestrator
          ├── EHR Adapter (FHIR: Patient, Coverage, Questionnaire, DocumentReference)
          ├── RCM Adapter (X12 270/271)
          ├── Pharmacy Lookup (NCPDP)
          ├── Anomaly Engine (rules-based + ML)
          └── Audit Trail
```

## HIPAA & Security Constraints

**CRITICAL**: This is a HIPAA-covered application. Follow these rules strictly:

1. **NO PHI in SMS/WhatsApp/Email** — Use magic-links only; collect PHI inside secure web app
2. **Voice recordings** — Retain per policy; redact transcripts before any LLM processing
3. **Encryption** — Encrypt sensitive columns; private S3/Storage buckets for cards/IDs
4. **Audit everything** — Log all consents, identity verifications, PHI access, EHR writes
5. **Row-Level Security (RLS)** — Enable on all Supabase tables with `tenant_id` scoping
6. **BAAs required** — Twilio, Supabase, clearinghouse, OCR vendors

## Data Model (Supabase/Postgres)

Core tables (see AI_NewPatient_Onboarding_Tech_Spec.md §3 for full schema):
- `tenants` — Multi-tenant configuration with white-label theme
- `patients` — Minimal identifiers; EHR linkage via `ehr_patient_id`
- `consents` — HIPAA NPP, consent to treat, financial responsibility, TCPA (voice + esign)
- `coverages` — Insurance details + real-time eligibility (271) response
- `intake_sessions` — Questionnaire answers + anomalies
- `pharmacies` — NCPDP-verified pharmacy preferences
- `audit_events` — Immutable log of all actions

## Key Patient Journeys

### A) Inbound Phone (Voice)
1. Emergency detection → route or disclaim
2. Capture name/DOB/language → send magic-link or continue voice
3. Read/record consent (voice acceptance with timestamp)
4. Create Patient + Intake Session
5. Offer appointment scheduling (optional)

### B) Web/Mobile (Magic-link)
1. OTP verification
2. Consent gates (NPP, treat, financial, TCPA)
3. Upload insurance card (front/back) → AI OCR → plan mapping
4. Real-time eligibility check (270/271)
5. Guided questionnaire (OB-GYN/Podiatry templates)
6. Generate DocumentReference (PDF consents + summary)
7. EHR write-back (Patient, Coverage, QuestionnaireResponse)

### C) In-office Kiosk
Fallback for incomplete pre-visit intake; resume session via QR/code

## API Endpoints (Edge Functions)

All in `supabase/functions/`:

- `POST /intake/start` — Initialize session, return magic-link
- `POST /intake/identity/verify` — OTP verification
- `POST /intake/consent` — Store consent evidence
- `POST /coverage/ocr` — Extract insurance card data (AI OCR)
- `POST /coverage/eligibility` — Real-time X12 270/271
- `POST /intake/answers` — Submit questionnaire (FHIR QuestionnaireResponse)
- `POST /ehr/writeback` — Upsert to EHR (Patient, Coverage, DocumentReference)

**Error codes**: 400 (validation), 409 (duplicate), 424 (EHR/RCM down), 500
**Idempotency**: Support `Idempotency-Key` header

## Anomaly Detection

Route issues to staff; never block patient flow.

**v1 Rules**:
- `INSURANCE_INACTIVE` / `MISMATCH` (from 271)
- `DUPLICATE_PATIENT` (phone+DOB fuzzy match)
- `MED_ALLERGY_CONFLICT` (self-report vs EHR)
- `MISSING_REFERRAL` / `AUTH` (payer rules)
- OB-GYN red flags (e.g., heavy bleeding + dizziness → nurse alert)

Output: `{type, severity, details, recommendedAction}`

## Brand & Voice (IntakePal + Allie)

See `brand_styleguide.md` for full details.

**Persona**: Allie — friendly, clear, calm, competent ("BFF → concierge, not a robot")

**Tone patterns**:
- Affirm: "Got it—let's do this in a couple of quick steps."
- Choice: "Would you like a link to your phone, or we can keep going here?"
- Consent: "I'll read a brief notice. Say 'I agree' when you're ready."
- Error: "Hmm, that didn't go through. Let's try again, or I can send a link."

**Design tokens** (Tailwind CSS):
```css
--brand-primary: #0EA5A0   /* Primary actions */
--brand-accent:  #7C3AED   /* Accents, links */
--ink:           #0F172A   /* Primary text */
--muted-ink:     #475569   /* Secondary text */
--surface:       #FFFFFF
--surface-alt:   #F8FAFC   /* Cards */
--success:       #0EA5A0
--warning:       #F59E0B
--danger:        #DC2626
```

**Typography**: Inter (600/700 headings, 400/500 body); Atkinson Hyperlegible for accessibility option

**Accessibility**: WCAG 2.2 AA — 4.5:1 contrast, keyboard nav, focus rings, screen-reader support, Spanish content

## Internationalization

- **Phase 1**: English + Spanish (EN/ES)
- Content packs for date/number formats
- Specialty templates (OB-GYN, Podiatry) with enableWhen logic

## White-label Theming

Per-tenant config in `tenants.theme` JSONB:
```json
{
  "logoUrl": "https://cdn.practice.example/logo.svg",
  "colors": {"primary": "#7c3aed", "accent": "#0ea5e9"},
  "typography": {"heading": "Inter", "body": "Inter"},
  "locale": "en-US",
  "pdf": {"headerLogo": true, "watermark": false}
}
```

## EHR/FHIR Mappings

- **Patient**: name, telecom, birthDate, language
- **Coverage**: subscriberId (member), payor, class (plan), beneficiary
- **Questionnaire/QuestionnaireResponse**: Specialty templates with conditional logic
- **DocumentReference**: Consent bundle PDF + intake summary
- **Appointment** (optional): Tentative slot creation

## Development Workflow

### Setup (when implemented)
```bash
# Install dependencies
npm install

# Set up Supabase locally (or use cloud project)
npx supabase init
npx supabase start

# Configure environment
cp .env.example .env.local
# Add: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, TWILIO_*, etc.

# Run dev server
npm run dev
```

### Testing (when implemented)
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- intake.test.ts

# E2E tests (when implemented)
npm run test:e2e
```

### Database Migrations (when implemented)
```bash
# Create new migration
npx supabase migration new <name>

# Apply migrations
npx supabase db push

# Reset local DB
npx supabase db reset
```

## Key Files & Structure (when implemented)

```
/app
  /(intake)/new-patient/page.tsx    # Main intake wizard
  /api/mocks/                        # Mock endpoints for demo
  /components/                       # shadcn/ui components
/supabase
  /functions/                        # Edge functions
    coverage-eligibility/
    ehr-writeback/
  /migrations/                       # DB schema versions
/public
  intakepal-logo.svg
```

## Common Patterns

### Edge Function Structure (TypeScript/Deno)
```ts
import { serve } from "https://deno.land/std/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const Body = z.object({
  sessionId: z.string().uuid(),
  // ... other fields
});

serve(async (req) => {
  try {
    const body = Body.parse(await req.json());
    // Business logic
    return new Response(JSON.stringify({ ok: true, ... }), {
      headers: { "content-type": "application/json" },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: `${e}` }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }
});
```

### React Intake Flow Pattern
```tsx
const [step, setStep] = useState<"verify"|"consent"|"coverage"|"history"|"review">("verify");

// Each step is a Card with shadcn/ui components
// Use Framer Motion for transitions (150-250ms, ease-out)
// Respect prefers-reduced-motion
```

### Audit Logging
Always log sensitive operations:
```ts
await supabase.from('audit_events').insert({
  tenant_id: session.tenant_id,
  actor: 'patient:123',
  action: 'consent.accepted',
  entity: 'consents',
  entity_id: consentId,
  meta: { mode: 'esign', ip: req.ip }
});
```

## Important Guidelines

1. **Never hardcode PHI** — Use seed data clearly marked "DEMO"
2. **Test channel rules** — Verify no PHI leaks into SMS/WhatsApp
3. **Validate payer mappings** — Insurance OCR must map to known payer IDs
4. **Anomaly flow** — Surface issues to staff console; never block patient
5. **Consent chain** — Identity verification → consent gates → data collection
6. **Voice recordings** — Redact transcripts before LLM; retain recordings per BAA
7. **Multi-tenant isolation** — Always filter by `tenant_id` in RLS policies
8. **Idempotency** — Support `Idempotency-Key` for EHR writes to prevent duplicates

## Phase 1 Exit Criteria (POC)

- >70% pre-arrival intake completion
- <5 min front-desk average for new patients
- >95% clean eligibility
- ≥4.6/5 patient CSAT
- Staff touches reduced by 60%+

## Reference Documents

- `Executive_OnePager_AI_NewPatient_Onboarding.md` — Business case, GTM
- `AI_NewPatient_Onboarding_Tech_Spec.md` — Full architecture, API specs, data model
- `brand_styleguide.md` — Voice, design tokens, components, copy patterns
- `super_agent_prompt.md` — AI agent build instructions (for landing + demo)
