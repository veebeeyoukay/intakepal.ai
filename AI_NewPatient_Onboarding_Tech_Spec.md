# AI‑Native New‑Patient Onboarding — Technical Spec (POC → GA)

**Scope**: Specialty‑agnostic core with **OB‑GYN** and **Podiatry** templates.  
**Tenancy**: White‑label, per‑practice configuration.  
**Channels**: Phone/voice, secure web/mobile, SMS/email/WhatsApp (no PHI outside secure web), in‑office kiosk fallback.  
**Integrations (Phase‑1)**: Athenahealth, eClinicalWorks, NextGen (FHIR R4), X12 270/271 via clearinghouse, pharmacy (NCPDP lookup), Surescripts meds (if tenant‑enabled).  
**Pilot geo**: Florida (PDMP reminders are prescriber‑side).  
**Stack**: React + TypeScript + shadcn/ui + Tailwind, Supabase (Auth/DB/Storage/Edge), Twilio (BAA).

---

## 1) Architecture (high‑level)

```
[PATIENT] —voice/SMS/web—> [Channel Layer: Twilio Voice/SMS, Email]
             ↓ magic-link (no PHI in SMS/WA)
[Secure Web App (PWA)] —API—> [Supabase Edge Orchestrator]
                                   |-- EHR Adapter (FHIR: Patient, Coverage, DocRef, Questionnaire/Response, Appointment)
                                   |-- RCM Adapter (X12 270/271 via clearinghouse)
                                   |-- Surescripts (med history, if enabled)
                                   |-- eFax + OCR/NLP (records in/out)
                                   |-- HIE/TEFCA hooks (Carequality/CommonWell) [Phase‑2+]
                                   |-- Anomaly Engine (rules + ML later)
                                   '-- Audit / Observability
```

**Identity & Consent**  
- Identity: OTP (SMS/email), DOB check; low‑risk posture initially.  
- Consents: HIPAA NPP, consent to treat, financial responsibility, TCPA; **voice acceptance** captured with timestamp + call SID; e‑sign audit trail for web.

**Channel Policy**  
- **No PHI** in SMS/WhatsApp. Use magic‑links to secure web.  
- Voice calls can read disclosures; recordings retained per policy; transcripts redacted before any model use.

---

## 2) Patient Journeys

### A) Inbound Phone (Replace IVR)
1. Detect emergency keywords → route to nurse/911 disclaimer; log event.  
2. New‑patient intent → capture name/DOB + preferred language → send magic‑link; or continue intake via voice for accessibility.  
3. Create/locate **Patient** (EHR) and **Intake Session**.  
4. Read/record **NPP/consent** (voice); store hash + audit.  
5. Optional: offer appointment windows (if EHR scheduling write allowed).

### B) Web/Mobile (Magic‑link)
1. OTP → consent gates → capture **driver’s license** (optional), **insurance ID (front/back)**.  
2. **AI OCR** extracts payer/member/group; **plan mapping**; kick off **270/271**.  
3. Guided **Questionnaire**: demographics confirmation, medical history (OB‑GYN/Podiatry), pharmacy (NCPDP lookup).  
4. Generate **DocumentReference** (PDF consents + intake summary) and **QuestionnaireResponse**.  
5. **Write‑back** to EHR; surface anomalies to staff; present appointment options or callback confirmation.

### C) In‑office Kiosk (iPad)
Fallback if pre‑visit intake incomplete. Patient resumes session with code/QR; same flows as web.

---

## 3) Data Model (Supabase/Postgres)

### Tables
```sql
-- Tenancy
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text unique,
  theme jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Patient index (non-PHI identifiers kept minimal; PHI in encrypted columns)
create table patients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  ehr_patient_id text, -- external link
  first_name text,
  last_name text,
  dob date,
  phone text,
  email text,
  lang text default 'en',
  created_at timestamptz default now()
);

-- Consents
create table consents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  patient_id uuid references patients(id) on delete cascade,
  type text check (type in ('HIPAA_NPP','CONSENT_TREAT','FIN_RESP','TCPA')),
  mode text check (mode in ('voice','esign')),
  accepted_at timestamptz not null,
  evidence jsonb, -- {callSid, ip, ua, geo, hash, pdfUrl}
  created_at timestamptz default now()
);

-- Coverage & Eligibility
create table coverages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  patient_id uuid references patients(id) on delete cascade,
  payer_name text,
  payer_id text,
  plan_id text,
  member_id text,
  group_id text,
  card_front_url text,
  card_back_url text,
  rte_271 jsonb, -- raw response excerpt
  status text,   -- active|inactive|unknown
  notes text,
  created_at timestamptz default now()
);

-- Intake Sessions
create table intake_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  patient_id uuid references patients(id) on delete cascade,
  questionnaire_id text, -- e.g., 'obgyn-new-pt-v1'
  answers jsonb,
  anomalies jsonb, -- [{type, severity, details}]
  status text check (status in ('open','submitted','written')) default 'open',
  created_at timestamptz default now()
);

-- Pharmacy
create table pharmacies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  patient_id uuid references patients(id) on delete cascade,
  ncpdp_id text,
  name text,
  phone text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Audit
create table audit_events (
  id bigserial primary key,
  tenant_id uuid references tenants(id) on delete cascade,
  actor text, -- system|patient|staff:{id}
  action text,
  entity text, -- patients|intake|coverage|consent
  entity_id uuid,
  meta jsonb,
  ts timestamptz default now()
);
```

**RLS**: enabled per `tenant_id` with row‑level policies; staff roles via Supabase Auth + JWT claims.  
**Encryption**: encrypt sensitive columns at application layer or pgcrypto; storage (cards/IDs/consents) in private buckets.

---

## 4) API Contracts (Edge Functions)

### POST /intake/start
**Body**: `{ tenantId, channel: "voice|web", phone?, email?, lang? }`  
**Returns**: `{ sessionId, magicLinkUrl }`

### POST /intake/identity/verify
**Body**: `{ sessionId, method: "otp", code }` → links `patient` record or creates stub.

### POST /intake/consent
**Body**: `{ sessionId, types: [...], mode: "voice|esign", evidence }`  
Stores consent, returns `DocumentReference` URL for PDF package.

### POST /coverage/ocr
**Body**: `{ sessionId, images: {front, back} }`  
**Returns**: `{ payerId, planId, memberId, groupId, confidence }`

### POST /coverage/eligibility
**Body**: `{ sessionId, payerId, memberId, dob, serviceType? }`  
**Returns**: `{ status, copay?, deductible?, notes, raw271 }`

### POST /intake/answers
**Body**: `{ sessionId, questionnaireId, answers: [...] }`  
Writes **QuestionnaireResponse** (FHIR‑mapped) and builds summary.

### POST /ehr/writeback
**Body**: `{ sessionId }` → upsert Patient/Demographics, Coverage, DocumentReference (consents + summary), QuestionnaireResponse, and optionally Appointment.

**Errors**: 400 (validation), 409 (duplicate), 424 (EHR/RCM down), 500.  
**Idempotency**: `Idempotency-Key` header supported.

---

## 5) EHR/FHIR Mappings (examples)

- **Patient**: name, telecom, birthDate, language.  
- **Coverage**: `subscriberId` (member), `payor` (payer org), `class` (plan), `beneficiary` (Patient).  
- **Questionnaire/QuestionnaireResponse**: OB‑GYN/Podiatry templates with enableWhen logic.  
- **DocumentReference**: consent bundle PDF + intake summary.  
- **Appointment** (optional Phase‑1): create tentative slot; confirm via staff.

Example `QuestionnaireResponse` (snippet):
```json
{
  "resourceType": "QuestionnaireResponse",
  "status": "completed",
  "questionnaire": "Questionnaire/obgyn-new-pt-v1",
  "subject": {"reference": "Patient/123"},
  "item": [
    {"linkId":"lmp","text":"Last menstrual period","answer":[{"valueDate":"2025-09-12"}]},
    {"linkId":"meds","text":"Current meds","answer":[{"valueString":"Prenatal vitamin"}]}
  ]
}
```

---

## 6) Anomaly Engine (route‑to‑team, never block)
**Rules v1**  
- `INSURANCE_INACTIVE|MISMATCH` (from 271)  
- `DUPLICATE_PATIENT` (match phone+dob or fuzzy)  
- `MED_ALLERGY_CONFLICT` (self‑report vs EHR)  
- `MISSING_REFERRAL|AUTH` (payer rules)  
- OB‑GYN red flags (heavy bleeding + dizziness → nurse alert)  
Output shape: `{type, severity, details, recommendedAction}` → staff console + EHR note.

---

## 7) Voice AI & Messaging

**Inbound Voice (Twilio)**  
- Webhook → intent classify → emergency check → create session → read disclosures (short‑form NPP) → capture “I agree” → text magic‑link or continue in‑call.  
- Recording stored; transcript redacted; `audit_events` appended.

**Messaging Policy**  
- SMS/WhatsApp/email carry **no PHI**; deliver magic‑links with short‑lived tokens.  
- WhatsApp Business allowed for notifications; PHI flows return to secure web.

---

## 8) Accessibility, i18n, Theming
- **WCAG/508**: semantic components, keyboard nav, high‑contrast mode, captions for voice content.  
- **Languages**: EN/ES (content packs, date/number formats).  
- **White‑label**: design tokens (logo, colors, fonts) per tenant; printable PDFs branded.

---

## 9) Observability & Security
- **Audit** for every read/write, consent, and identity event.  
- **MFA** for staff; RBAC (admin, front‑desk, billing, clinician).  
- **Secrets** in Supabase vault; KMS‑backed encryption; per‑tenant data isolation.  
- **BAA** with comms and hosting vendors; data retention policies for recordings/images.

---

## 10) KPIs & Analytics (POC)
- Intake completion %, average minutes saved at front desk, % clean eligibility, anomalies per 100 intakes, patient CSAT/NPS, no‑show delta; staff touches per new patient; time‑to‑room.

---

## 11) React UI Skeleton (shadcn/ui)

```tsx
// app/(intake)/new-patient/page.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewPatientIntake() {
  const [step, setStep] = useState<"verify"|"consent"|"coverage"|"history"|"pharmacy"|"review">("verify");

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-sm text-muted-foreground">Secure new‑patient intake</p>
      </header>

      {step === "verify" && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <Input placeholder="Mobile number or email" aria-label="Contact" />
            <Button onClick={() => setStep("consent")} className="w-full">Send Code</Button>
          </CardContent>
        </Card>
      )}

      {step === "consent" && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <label className="font-medium">Notices & Consents</label>
              <div className="flex items-start space-x-2">
                <Checkbox id="npp" /><label htmlFor="npp">I acknowledge the HIPAA Notice of Privacy Practices</label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="treat" /><label htmlFor="treat">I consent to treatment</label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="fin" /><label htmlFor="fin">I accept financial responsibility</label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox id="tcpa" /><label htmlFor="tcpa">I consent to SMS/voice per TCPA</label>
              </div>
            </div>
            <Button onClick={() => setStep("coverage")} className="w-full">Continue</Button>
          </CardContent>
        </Card>
      )}

      {/* Additional steps: coverage (upload front/back), history (dynamic Qs), pharmacy (NCPDP search), review */}
    </div>
  );
}
```

---

## 12) Example Edge Function (TypeScript, Supabase)

```ts
// supabase/functions/coverage-eligibility/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const Body = z.object({
  sessionId: z.string().uuid(),
  payerId: z.string(),
  memberId: z.string(),
  dob: z.string(), // ISO date
  serviceType: z.string().optional()
});

serve(async (req) => {
  try {
    const json = await req.json();
    const body = Body.parse(json);

    // TODO: call clearinghouse (X12 270) and parse 271 response
    const mock = { status: "active", copay: "35.00", deductible: "500.00", notes: "PCP not required" };

    return new Response(JSON.stringify({ ok: true, ...mock }), {
      headers: { "content-type": "application/json" },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: `${e}` }), {
      headers: { "content-type": "application/json" },
      status: 400
    });
  }
});
```

---

## 13) POC Plan (90 days)

**Phase 0 (2–3 wks)**: Brand skinning, OB‑GYN & Podiatry questionnaires, consent pack, voice line + magic‑link, fake EHR/271.  
**Phase 1 (4–6 wks)**: Athena FHIR write‑back; eligibility via clearinghouse; insurance OCR; EN/ES; WCAG/508.  
**Phase 2 (6–10 wks)**: eCW/NextGen adapters; eFax OCR/NLP; PDMP reminders; staff console + analytics; anomaly rules v1.

**Exit Criteria**: >70% pre‑arrival intake completion; <5 min front‑desk average for new patients; >95% clean eligibility; ≥4.6/5 patient CSAT.

---

## 14) Risk & Compliance Notes
- **WhatsApp** restricted to non‑PHI nudges; all PHI in secure web/app.  
- **Model usage**: redact PHI in prompts or use PHI‑safe endpoints; log model access.  
- **Recordings**: retention configurable; legal discovery friendly; consent language provided.  
- **BAAs**: platform + comms + OCR vendors signed before GA.

---

## 15) Theming Tokens (per tenant)
```json
{
  "logoUrl": "https://cdn.practice.example/logo.svg",
  "colors": { "primary": "#7c3aed", "accent": "#0ea5e9", "surface": "#ffffff" },
  "typography": { "heading": "Inter", "body": "Inter" },
  "locale": "en-US",
  "pdf": { "headerLogo": true, "watermark": false }
}
```