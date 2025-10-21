// Design tokens from brand guide
export const COLORS = {
  brandPrimary: "#0EA5A0",
  brandAccent: "#7C3AED",
  ink: "#0F172A",
  mutedInk: "#475569",
  surface: "#FFFFFF",
  surfaceAlt: "#F8FAFC",
  success: "#0EA5A0",
  warning: "#F59E0B",
  danger: "#DC2626",
} as const;

// Brand voice and positioning
export const BRAND = {
  name: "IntakePal",
  domain: "IntakePal.ai",
  agent: "Allie",
  tagline: "The friendliest first step in care.",
  elevator: "IntakePal is the friendly, AI-native front door for healthcare practices.",
} as const;

// Copy patterns from brand guide
export const COPY = {
  hero: {
    title: "Meet Allie, your IntakePal.",
    subtitle: "The friendliest first step in care.",
    features: [
      "Pre-visit intake via voice, text, or web — no clipboards",
      "Real-time eligibility + ID/insurance OCR",
      "EHR write-back (demographics, consents, histories)",
      "Spanish + accessibility built-in",
    ],
    ctaPrimary: "Start Florida pilot",
    ctaSecondary: "See 3-min demo",
  },
  consent: {
    types: [
      {
        id: "HIPAA_NPP",
        label: "I acknowledge the HIPAA Notice of Privacy Practices",
        description:
          "This notice explains how your health information may be used and disclosed.",
      },
      {
        id: "CONSENT_TREAT",
        label: "I consent to treatment",
        description:
          "I give permission to receive care and treatment from this practice.",
      },
      {
        id: "FIN_RESP",
        label: "I accept financial responsibility",
        description:
          "I understand I am responsible for charges not covered by insurance.",
      },
      {
        id: "TCPA",
        label: "I consent to SMS/voice per TCPA",
        description:
          "I agree to receive text messages and calls about my care. Reply STOP to opt out.",
      },
    ],
  },
} as const;

// Mock data for demo
export const DEMO_DATA = {
  patient: {
    firstName: "Jane",
    lastName: "Doe (DEMO)",
    dob: "1985-06-15",
    phone: "+1-555-0123",
    email: "jane.demo@example.com",
    lang: "en",
  },
  coverage: {
    payerName: "Blue Cross Blue Shield (DEMO)",
    payerId: "BCBS-FL",
    planId: "PPO-1000",
    memberId: "ABC123456789",
    groupId: "GRP-999",
    status: "active",
    copay: "35.00",
    deductible: "500.00",
    notes: "PCP not required",
  },
  pharmacy: {
    ncpdpId: "1234567",
    name: "Walgreens Pharmacy #12345 (DEMO)",
    phone: "+1-555-7890",
    address: "123 Main St, Orlando, FL 32801",
  },
} as const;

// Anomaly types from tech spec
export const ANOMALY_TYPES = {
  INSURANCE_INACTIVE: "Insurance policy inactive or expired",
  INSURANCE_MISMATCH: "Insurance details don't match member ID",
  DUPLICATE_PATIENT: "Potential duplicate patient record detected",
  MED_ALLERGY_CONFLICT: "Medication allergy conflict detected",
  MISSING_REFERRAL: "Referral authorization may be required",
  MISSING_AUTH: "Prior authorization may be required",
  RED_FLAG_CLINICAL: "Clinical concern flagged for review",
} as const;
