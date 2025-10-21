# IntakePal — Brand Style Guide (v0.1)

> Working brand/domain: **IntakePal.ai**  • Agent persona: **Allie**  • Positioning: *“The friendliest first step in care.”*  
> White‑label ready. This guide defines voice, visuals, accessibility, and component tokens to keep us consistent across web, voice, SMS, and PDFs.

---

## 1) Brand Essence
- **Promise**: Intake that feels human—while staying HIPAA‑strong.  
- **Personality**: Friendly, clear, calm, competent. (BFF → concierge, not a robot.)  
- **Value Props**:  
  - *Capture once. Pre‑fill everywhere.*  
  - Omnichannel (voice/SMS/web) with EHR write‑back.  
  - Real‑time eligibility + ID/insurance OCR.  
  - Spanish + accessibility built‑in.

### Elevator Pitch (internal)
> *IntakePal is the friendly, AI‑native front door for healthcare practices. Our agent, Allie, meets patients by voice, text, or web to get everything ready before they arrive—eligibility, consents, and history—then writes it back to the EHR. It’s delightful for patients and a time‑saver for staff.*

---

## 2) Naming & Voice
- **Product**: IntakePal  
- **Agent**: Allie (“your IntakePal who walks you in”)  
- **Tone**: Warm > Clear > Brief > Reassuring > Respectful  
- **Do**: “Hi, I’m Allie—I’ll walk you in. Prefer voice, text, or web?”  
- **Don’t**: Jargon (“FHIR endpoints”, “X12 271 segments”) in patient‑facing text.

### Microcopy Patterns
- **Affirm**: “Got it—let’s do this in a couple of quick steps.”  
- **Choice**: “Would you like a link to your phone, or we can keep going here?”  
- **Consent**: “I’ll read a brief notice. Say ‘I agree’ when you’re ready.”  
- **Error**: “Hmm, that didn’t go through. Let’s try again, or I can send a link.”  
- **Accessibility**: “Need larger text or Spanish? I’ve got you.”

---

## 3) Accessibility (WCAG 2.2 AA+)
- Color contrast AA minimum (4.5:1 text/interactive; 3:1 for large text).  
- Keyboard and screen‑reader support; focus rings visible; skip links.  
- Provide transcripts/captions for voice content; avoid flashing motion.  
- Use **Atkinson Hyperlegible** or similar for long-form text options.

---

## 4) Color System (Accessible)
Primary and neutrals optimized for contrast. Test pairings before use.

| Token | HEX | Usage |
|---|---|---|
| `--brand-primary` | `#0EA5A0` | Primary actions, highlights |
| `--brand-accent` | `#7C3AED` | Accents, links, chips |
| `--ink` | `#0F172A` | Primary text on light |
| `--muted-ink` | `#475569` | Secondary text |
| `--surface` | `#FFFFFF` | Background |
| `--surface-alt` | `#F8FAFC` | Cards, sections |
| `--success` | `#0EA5A0` | Success states (aligned with primary) |
| `--warning` | `#F59E0B` | Caution banners |
| `--danger` | `#DC2626` | Errors |

**Tailwind CSS variables (globals):**
```css
:root{
  --brand-primary:#0EA5A0;
  --brand-accent:#7C3AED;
  --ink:#0F172A;
  --muted-ink:#475569;
  --surface:#FFFFFF;
  --surface-alt:#F8FAFC;
  --success:#0EA5A0;
  --warning:#F59E0B;
  --danger:#DC2626;
}
```

**Accessible pairs (AA+):**
- Buttons: `--brand-primary` bg on `--surface` with `--surface` text? **No** → Use `--ink` text on `--brand-primary` or keep white text with shadow/weight and verify ratio.  
- Preferred: `bg-[--brand-primary] text-white` (check ratio 4.5:1) and `bg-[--surface] text-[--ink] border-[--brand-primary]` for outline.

---

## 5) Typography
- **Headings/UI**: **Inter** (600/700 for headings, 400/500 for body).  
- **Accessibility option**: **Atkinson Hyperlegible** for long reads.  
- **Scale**: 12, 14, 16, 18, 20, 24, 30, 36, 48.  
- **Letter‑spacing**: slightly tighter for H1/H2 (-0.01em).  
- **Line height**: 1.3–1.5 body; 1.15 headings.

---

## 6) Logo & Mark
- **Concept**: Rounded doorway + chat bubble smiling inside (Allie).  
- **Clearspace**: 1× logo height min; keep off busy photos.  
- **Min size**: 24px height (SVG recommended).  
- **Colors**: Single‑color marks in `--ink`, white, or `--brand-primary`.

**Simple SVG (starter):**
```svg
<svg width="200" height="48" viewBox="0 0 200 48" xmlns="http://www.w3.org/2000/svg" aria-label="IntakePal">
  <defs><style>
    .t{font-family:Inter,system-ui,-apple-system,sans-serif;font-weight:700;font-size:24px;fill:#0F172A}
  </style></defs>
  <g>
    <path d="M20 38c-6 0-10-4-10-10V16c0-6 4-10 10-10s10 4 10 10v12c0 6-4 10-10 10z" fill="#0EA5A0" />
    <path d="M15 26c2 3 8 3 10 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="20" r="1.8" fill="white"/><circle cx="24" cy="20" r="1.8" fill="white"/>
  </g>
  <text class="t" x="44" y="30">IntakePal</text>
</svg>
```

---

## 7) Iconography & Illustration
- Icons: **lucide-react** (consistent 1.5–2px stroke).  
- Illustration: friendly line art, soft corners; human elements where possible; avoid medical gore/needles imagery.

---

## 8) Motion
- Use **Framer Motion**; durations 150–250ms; ease‑out for entrances; reduce‑motion media query respected.  
- Subtle micro‑interactions for success/error; no parallax or auto‑scroll.

---

## 9) Components (shadcn/ui)
**Buttons**
- Primary: `bg-[--brand-primary] text-white rounded-2xl shadow-sm hover:opacity-90`
- Secondary: `border border-[--brand-primary] text-[--ink] bg-[--surface]`
- Destructive: `bg-[--danger] text-white`

**Cards**: rounded‑2xl, soft shadow, `bg-[--surface]` on `--surface-alt`.  
**Inputs**: large tap targets (44px), clear labels/help, error text visible.  
**Alerts**: color‑coded with icon (info/success/warn/error).

---

## 10) Content Examples

### Landing Hero
- **H1**: *Meet Allie, your IntakePal.*  
- **H2**: *The friendliest first step in care.*  
- **Bullets**: No clipboards; real‑time eligibility; EHR write‑back; Spanish + accessibility.  
- **CTAs**: “Start Florida pilot” / “See 3‑min demo”.

### IVR Greeting
> “Hi, I’m **Allie**, your IntakePal. I can help with new‑patient intake, questions about services, or getting you ready for your visit. If this is an emergency, hang up and dial 911. How can I help today?”

### SMS (no PHI)
> Hi, I’m Allie from IntakePal. Tap to start your secure intake: {short‑link}. Prefer a call? Reply CALL.

### Consent (voice)
> “I’ll read a brief privacy notice. Say ‘I agree’ to accept and continue.”

---

## 11) Compliance Notes (summary)
- **HIPAA**: no PHI in SMS/WhatsApp; PHI only in secure web/app and EHR; BAA with vendors.  
- **TCPA**: explicit opt‑in for SMS/voice; provide STOP/HELP.  
- **Audit**: every consent, access, and write is logged.

---

## 12) SEO & Meta
- Title ≤ 60 chars; meta description ≤ 155 chars.  
- OpenGraph/Twitter card with mark on clean background.  
- Alt text for marks and key visuals.

---

## 13) Sample React Hero (shadcn/ui)
```tsx
import { Button } from "@/components/ui/button";

export default function Hero(){
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="text-sm font-medium text-[--brand-primary]">IntakePal</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Meet Allie, your IntakePal.</h1>
      <p className="mt-3 text-lg text-muted-foreground">The friendliest first step in care.</p>
      <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
        <li>• Pre-visit intake via voice, text, or web — <strong>no clipboards</strong></li>
        <li>• <strong>Real-time eligibility</strong> + <strong>ID/insurance OCR</strong></li>
        <li>• <strong>EHR write-back</strong> (demographics, consents, histories)</li>
        <li>• <strong>Spanish + accessibility</strong> built-in</li>
      </ul>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button className="h-10 px-6">Start Florida pilot</Button>
        <Button variant="outline" className="h-10 px-6">See 3-min demo</Button>
      </div>
    </section>
  );
}
```

---

## 14) File Hygiene
- Keep source SVGs; export SVG/PNG @1x/@2x; use semantic filenames: `intakepal-logo-primary.svg`, `intakepal-mark-white.svg`.
- Version PDFs as `brand_guide_v{major.minor}.pdf`.