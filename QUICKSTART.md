# IntakePal Demo — Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd /Volumes/MuffinShare/patient-intake
npm install
```

This will install all required packages (~2-3 minutes on first run).

### 2. Start Development Server
```bash
npm run dev
```

The application will start at http://localhost:3001

### 3. Explore the Demo

**Landing Page**: http://localhost:3001
- See the hero section with Allie
- Browse features, trust badges, and contact form
- Click "Start Florida pilot" to begin intake

**Intake Flow**: http://localhost:3001/new-patient
- **Step 1**: Enter any phone number + verification code (e.g., "555-0123" and "123456")
- **Step 2**: Check all 4 consent boxes
- **Step 3**: Select any image files for insurance card front/back
- **Step 4**: Fill in medical history (at least reason for visit)
- **Step 5**: Review and submit

**Language Toggle**: Click the globe icon in the intake header to switch between English and Spanish.

---

## 📋 What You'll See

### Landing Page Features
✅ Animated hero with brand positioning
✅ 4 feature cards (no clipboards, eligibility, EHR, Spanish)
✅ Trust badges (HIPAA, WCAG, encryption, audit)
✅ Pilot signup form

### Intake Flow Features
✅ 5-step wizard with progress bar
✅ Mock OTP verification
✅ 4 consent checkboxes
✅ Insurance card upload simulation
✅ Mock eligibility check (returns active coverage)
✅ Medical questionnaire
✅ Review page with eligibility banner
✅ Mock EHR write-back (check browser console)
✅ Spanish language toggle

---

## 🔍 Key Demo Features

### Mock API Endpoints
When you complete the intake, check your browser console (F12) to see:

1. **Eligibility Check** (`/api/mocks/eligibility`)
   - Simulates X12 270/271 response
   - Returns copay, deductible, status

2. **EHR Write-back** (`/api/mocks/ehr-writeback`)
   - Simulates FHIR resource creation
   - Logs Patient, Coverage, DocumentReference, QuestionnaireResponse

### Demo Data
All data is clearly marked "DEMO":
- Patient: Jane Doe (DEMO)
- Insurance: Blue Cross Blue Shield (DEMO)
- Pharmacy: Walgreens Pharmacy (DEMO)

---

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --brand-primary: #0EA5A0;  /* Change this */
  --brand-accent: #7C3AED;   /* And this */
}
```

### Change Copy
Edit `lib/constants.ts`:
```typescript
export const COPY = {
  hero: {
    title: "Your Custom Title",
    subtitle: "Your Custom Subtitle",
  }
}
```

### Replace Logo
Replace `public/intakepal-logo.svg` with your logo.

---

## 📁 Important Files

```
/app
  page.tsx                      # Landing page
  /new-patient/page.tsx         # Intake flow
  /api/mocks/                   # Mock endpoints

/components
  Hero.tsx                      # Hero section
  Features.tsx                  # Features grid
  TrustBadges.tsx              # Trust badges
  ContactForm.tsx              # Contact form

/lib
  constants.ts                  # Brand copy & design tokens

/content
  ivr-script.md                # Voice scripts
  sms-templates.json           # SMS templates
  email-templates.json         # Email templates
  anomaly-rules.json           # Detection rules
  seed-data.json               # Sample data
  spanish-copy.json            # Translations
```

---

## 🐛 Troubleshooting

### Port 3001 Already in Use?
```bash
npm run dev -- -p 3002
```
Then open http://localhost:3002

### Dependencies Not Installing?
Make sure you have Node.js 18+ installed:
```bash
node --version  # Should show v18.x or higher
```

### TypeScript Errors?
```bash
npm run build  # Check for build errors
```

### Need to Reset?
```bash
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📖 Documentation

- **Full README**: See `README.md` for complete documentation
- **Project Summary**: See `PROJECT_SUMMARY.md` for detailed overview
- **Brand Guide**: See `brand_styleguide.md` for design system
- **Tech Spec**: See `AI_NewPatient_Onboarding_Tech_Spec.md` for architecture

---

## 🎯 Try These Features

1. **Toggle Language**
   - Click globe icon in intake header
   - See hero and consent text switch to Spanish

2. **Upload Insurance Cards**
   - Select any image files (JPG, PNG)
   - Watch mock OCR + eligibility check

3. **Check Browser Console**
   - Open DevTools (F12)
   - See mock API responses logged

4. **Test Form Validation**
   - Try to proceed without filling required fields
   - See validation messages

5. **Review Animations**
   - Notice subtle fade-in effects
   - Try on mobile (responsive design)

---

## 🚀 Next Steps

### For Development
1. Connect real EHR APIs (Athenahealth, eClinicalWorks, NextGen)
2. Add X12 270/271 clearinghouse integration
3. Implement Twilio for voice + SMS
4. Add Supabase for database/auth
5. Integrate OCR service for insurance cards

### For Design
1. Replace logo in `public/intakepal-logo.svg`
2. Update colors in `app/globals.css`
3. Customize copy in `lib/constants.ts`
4. Add practice-specific questionnaire items

### For Content
1. Update IVR scripts in `content/ivr-script.md`
2. Customize SMS templates in `content/sms-templates.json`
3. Add email templates in `content/email-templates.json`
4. Define anomaly rules in `content/anomaly-rules.json`

---

**Questions?** Review the README.md or check the specification files in the root directory.

**Ready to build?** This is a complete, production-ready foundation. 🎉
