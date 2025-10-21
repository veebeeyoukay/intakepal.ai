// IVR Flow Logic - Based on content/ivr-script.md

import { IVRStep, IVRFlowNode, VoiceChatState, UserIntent } from '@/types/voice-chat';

// Emergency keywords
const EMERGENCY_KEYWORDS = [
  'emergency', '911', 'ambulance', 'chest pain', 'bleeding', 'severe',
  'trouble breathing', 'cant breathe', 'heart attack', 'stroke', 'unconscious'
];

// Intent classification keywords
const NEW_PATIENT_KEYWORDS = ['new patient', 'intake', 'first visit', 'new', 'register', 'sign up'];
const APPOINTMENT_KEYWORDS = ['appointment', 'schedule', 'book', 'visit', 'see doctor'];
const BILLING_KEYWORDS = ['billing', 'bill', 'payment', 'insurance', 'cost', 'charge'];
const PHARMACY_KEYWORDS = ['pharmacy', 'prescription', 'medication', 'drug'];

// Consent keywords
const CONSENT_YES = ['yes', 'i agree', 'agree', 'i do', 'okay', 'ok', 'accept'];
const CONSENT_NO = ['no', 'disagree', 'i do not', "don't", 'reject'];

/**
 * Detect emergency keywords in user input
 */
export function detectEmergency(input: string): boolean {
  const lowerInput = input.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lowerInput.includes(keyword));
}

/**
 * Classify user intent from input
 */
export function classifyIntent(input: string): UserIntent {
  const lowerInput = input.toLowerCase();

  if (EMERGENCY_KEYWORDS.some(k => lowerInput.includes(k))) return 'emergency';
  if (NEW_PATIENT_KEYWORDS.some(k => lowerInput.includes(k))) return 'new_patient';
  if (APPOINTMENT_KEYWORDS.some(k => lowerInput.includes(k))) return 'appointment';
  if (BILLING_KEYWORDS.some(k => lowerInput.includes(k))) return 'billing';
  if (PHARMACY_KEYWORDS.some(k => lowerInput.includes(k))) return 'pharmacy';

  return 'unknown';
}

/**
 * Check if user gave consent
 */
export function checkConsent(input: string): boolean | null {
  const lowerInput = input.toLowerCase();

  if (CONSENT_YES.some(phrase => lowerInput.includes(phrase))) return true;
  if (CONSENT_NO.some(phrase => lowerInput.includes(phrase))) return false;

  return null; // Unclear
}

/**
 * Extract name from input (simple heuristic)
 */
export function extractName(input: string): { firstName?: string; lastName?: string } {
  const words = input.trim().split(/\s+/);

  if (words.length >= 2) {
    return {
      firstName: words[0],
      lastName: words.slice(1).join(' ')
    };
  } else if (words.length === 1) {
    return { firstName: words[0] };
  }

  return {};
}

/**
 * Extract date of birth (simple validation)
 */
export function extractDOB(input: string): string | null {
  // Look for MM/DD/YYYY or similar patterns
  const dobPattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
  const match = input.match(dobPattern);
  return match ? match[0] : null;
}

/**
 * Extract contact info (phone or email)
 */
export function extractContact(input: string): { phone?: string; email?: string } {
  const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/;
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

  const phoneMatch = input.match(phonePattern);
  const emailMatch = input.match(emailPattern);

  return {
    phone: phoneMatch ? phoneMatch[0] : undefined,
    email: emailMatch ? emailMatch[0] : undefined
  };
}

/**
 * IVR Flow Definition
 */
export const IVR_FLOW: Record<IVRStep, IVRFlowNode> = {
  greeting: {
    step: 'greeting',
    message: `Hi, I'm **Allie**, your IntakePal. I can help with new patient intake, questions about services, or getting you ready for your visit.

**If this is a medical emergency, please hang up and dial 9-1-1 immediately.**

How can I help you today?`,
    nextStep: (input) => {
      if (detectEmergency(input)) return 'emergency_check';
      return 'intent_classification';
    }
  },

  emergency_check: {
    step: 'emergency_check',
    message: `It sounds like you may need immediate care. **If this is a medical emergency, please hang up and dial 9-1-1 or go to the nearest emergency room.**

Would you like me to connect you with our nurse line, or shall I help with something else?`,
    nextStep: 'intent_classification'
  },

  intent_classification: {
    step: 'intent_classification',
    message: (state) => {
      const intent = state.userIntent;

      if (intent === 'new_patient') {
        return `Great! I'll help you get everything ready for your first visit. Let's start with some basic information.`;
      } else if (intent === 'appointment') {
        return `I can help you schedule an appointment. Let me get a few details first.`;
      } else if (intent === 'billing') {
        return `For billing questions, I can connect you with our team. They're available Monday through Friday, 9 AM to 5 PM.

Would you like to continue, or is there something else I can help with?`;
      } else if (intent === 'pharmacy') {
        return `Our preferred pharmacy partners are Walgreens, CVS, and Publix. You can also choose your own pharmacy.

I'll ask about your pharmacy preference during intake. Anything else I can help with?`;
      }

      return `I didn't quite catch that. Are you looking to:
• Complete **new patient intake**
• Schedule an **appointment**
• Ask about **billing**
• Get **pharmacy** information

Just let me know what works for you!`;
    },
    nextStep: (input, state) => {
      if (state.userIntent === 'new_patient') return 'identity_name';
      if (state.userIntent === 'appointment') return 'appointment_scheduling';
      if (state.userIntent === 'billing') return 'billing_routing';
      if (state.userIntent === 'pharmacy') return 'pharmacy_info';

      // Re-classify
      const newIntent = classifyIntent(input);
      if (newIntent === 'new_patient') return 'identity_name';

      return 'error_recovery';
    }
  },

  identity_name: {
    step: 'identity_name',
    message: `Perfect! Let's get started. What's your **first and last name**?`,
    nextStep: 'identity_dob',
    extractData: (input) => {
      const { firstName, lastName } = extractName(input);
      return { firstName, lastName };
    }
  },

  identity_dob: {
    step: 'identity_dob',
    message: (state) => {
      const name = state.collectedData.firstName || 'there';
      return `Thanks, ${name}! And what's your **date of birth**? (MM/DD/YYYY)`;
    },
    nextStep: 'language_preference',
    extractData: (input) => {
      const dob = extractDOB(input);
      return dob ? { dateOfBirth: dob } : {};
    },
    validation: (input) => extractDOB(input) !== null,
    errorMessage: `I didn't catch that date. Please enter your date of birth in MM/DD/YYYY format (for example, 06/15/1985).`
  },

  language_preference: {
    step: 'language_preference',
    message: `Would you like to continue in **English** or **Spanish**?

(Just say "English" or "Español")`,
    nextStep: 'consent_intro',
    extractData: (input) => {
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('spanish') || lowerInput.includes('español')) {
        return { language: 'es' };
      }
      return { language: 'en' };
    }
  },

  consent_intro: {
    step: 'consent_intro',
    message: (state) => {
      if (state.collectedData.language === 'es') {
        return `Leeré un breve aviso de privacidad. Este aviso explica cómo protegemos su información de salud bajo HIPAA.

¿Reconoce este aviso y acepta continuar? Diga "Acepto" o "No acepto".`;
      }

      return `I'll read a brief privacy notice. This notice explains how we protect your health information under HIPAA.

**Notice of Privacy Practices**: We collect and use your health information to provide care, process billing, and improve our services. Your information is protected under federal law. You have the right to access and request changes to your health information.

Do you acknowledge this notice and agree to continue? Say **"I agree"** or **"I do not agree"**.`;
    },
    nextStep: 'consent_confirmation'
  },

  consent_confirmation: {
    step: 'consent_confirmation',
    message: (state) => {
      const consentGiven = state.collectedData.consentGiven;

      if (consentGiven === false) {
        if (state.collectedData.language === 'es') {
          return `No hay problema. No podemos continuar sin consentimiento, pero puede completar la admisión en persona.

¿Le gustaría programar una cita?`;
        }
        return `No problem. We can't continue without consent, but you're welcome to complete intake in person.

Would you like to schedule an appointment instead?`;
      }

      if (state.collectedData.language === 'es') {
        return `¡Perfecto! Enviaré un enlace seguro a su teléfono o correo electrónico para que pueda cargar su tarjeta de seguro y completar el resto a su conveniencia.`;
      }

      return `Perfect! I'll send a secure link to your phone or email so you can upload your insurance card and complete the rest at your convenience.`;
    },
    nextStep: (input, state) => {
      if (state.collectedData.consentGiven === false) {
        return 'appointment_scheduling';
      }
      return 'magic_link_offer';
    },
    extractData: (input) => {
      const consent = checkConsent(input);
      return consent !== null
        ? { consentGiven: consent, consentTimestamp: new Date().toISOString() }
        : {};
    }
  },

  magic_link_offer: {
    step: 'magic_link_offer',
    message: (state) => {
      if (state.collectedData.language === 'es') {
        return `¿Cuál es el mejor número de teléfono o correo electrónico para usted?

(O diga "continuar por voz" si prefiere completar todo ahora)`;
      }

      return `What's the best **phone number** or **email** for you?

(Or say **"continue by voice"** if you'd prefer to complete everything now)`;
    },
    nextStep: (input) => {
      if (input.toLowerCase().includes('continue') || input.toLowerCase().includes('voice')) {
        return 'end_demo'; // In demo, this would continue to full intake
      }
      return 'contact_collection';
    }
  },

  contact_collection: {
    step: 'contact_collection',
    message: (state) => {
      const contact = state.collectedData.phone || state.collectedData.email;

      if (state.collectedData.language === 'es') {
        return `¡Listo! Revise sus mensajes en el próximo minuto. Hemos enviado un enlace seguro a ${contact}.

En la vida real, completaría el resto en su teléfono. ¿Le gustaría continuar con la demo de admisión ahora?`;
      }

      return `Done! Check your messages in the next minute. We've sent a secure link to ${contact}.

In the real app, you'd complete the rest on your phone. **Would you like to continue to the intake demo now?**`;
    },
    nextStep: 'end_demo',
    extractData: (input) => extractContact(input)
  },

  appointment_scheduling: {
    step: 'appointment_scheduling',
    message: `I can check availability for you. What type of visit are you looking for?

• Annual physical
• New patient consultation
• Follow-up appointment

(In the real system, I'd show you available time slots from the EHR)`,
    nextStep: 'end_demo'
  },

  billing_routing: {
    step: 'billing_routing',
    message: `For billing questions, our team is available **Monday through Friday, 9 AM to 5 PM**.

In the live system, I would transfer you now or take a callback number.

**Would you like to continue to the intake demo instead?**`,
    nextStep: 'end_demo'
  },

  pharmacy_info: {
    step: 'pharmacy_info',
    message: `Our preferred pharmacy partners are:
• **Walgreens Pharmacy**
• **CVS Pharmacy**
• **Publix Pharmacy**

You can also choose your own pharmacy. I'll ask about your preference during the full intake.

**Would you like to continue to the intake demo?**`,
    nextStep: 'end_demo'
  },

  error_recovery: {
    step: 'error_recovery',
    message: `Hmm, I didn't catch that. Could you repeat it?

Or you can say:
• "New patient" for intake
• "Appointment" to schedule
• "Billing" for payment questions`,
    nextStep: 'intent_classification'
  },

  end_demo: {
    step: 'end_demo',
    message: (state) => {
      const name = state.collectedData.firstName;
      const hasData = name || state.collectedData.dateOfBirth;

      if (hasData) {
        return `Thanks${name ? ', ' + name : ''}! In the real IntakePal system, you would either:

**📱 Receive a magic link** via SMS/email to complete intake on your phone, or
**🎤 Continue by voice** to finish everything now

**Would you like to:**
• **Continue to full intake demo** (I'll pre-fill your information)
• **End demo** and explore more`;
      }

      return `Thanks for trying the voice demo!

**Would you like to:**
• **Continue to full intake demo**
• **End demo** and explore more`;
    },
    nextStep: 'end_demo'
  }
};

/**
 * Get next step based on current step and user input
 */
export function getNextStep(
  currentStep: IVRStep,
  userInput: string,
  state: VoiceChatState
): IVRStep {
  const node = IVR_FLOW[currentStep];

  if (typeof node.nextStep === 'function') {
    return node.nextStep(userInput, state);
  }

  return node.nextStep;
}

/**
 * Get message for current step
 */
export function getMessage(step: IVRStep, state: VoiceChatState): string {
  const node = IVR_FLOW[step];

  if (typeof node.message === 'function') {
    return node.message(state);
  }

  return node.message;
}

/**
 * Extract data from user input for current step
 */
export function extractStepData(
  step: IVRStep,
  userInput: string,
  state: VoiceChatState
): Partial<VoiceChatState['collectedData']> {
  const node = IVR_FLOW[step];

  if (node.extractData) {
    return node.extractData(userInput, state);
  }

  return {};
}

/**
 * Validate user input for current step
 */
export function validateInput(step: IVRStep, userInput: string): boolean {
  const node = IVR_FLOW[step];

  if (node.validation) {
    return node.validation(userInput);
  }

  return true; // No validation required
}

/**
 * Get error message for failed validation
 */
export function getErrorMessage(step: IVRStep): string | null {
  const node = IVR_FLOW[step];
  return node.errorMessage || null;
}
