# IntakePal Voice/IVR Script

## Main Greeting

> "Hi, I'm **Allie**, your IntakePal. I can help with new patient intake, questions about services, or getting you ready for your visit."
>
> "If this is a medical emergency, hang up and dial 9-1-1 immediately."
>
> "How can I help you today?"

**Intents:**
- "New patient" → Route to intake flow
- "Appointment" → Route to scheduling
- "Billing" → Route to billing team
- "Pharmacy" → Provide pharmacy info
- Emergency keywords (pain, bleeding, chest, etc.) → Emergency disclaimer + route

---

## Emergency Detection & Handling

**Keywords:** `emergency`, `911`, `ambulance`, `chest pain`, `bleeding`, `severe`, `trouble breathing`

**Response:**
> "It sounds like you may need immediate care. If this is a medical emergency, please hang up and dial 9-1-1 or go to the nearest emergency room."
>
> "Would you like me to connect you with our nurse line, or shall I help with something else?"

**Log Event:** `EMERGENCY_KEYWORD_DETECTED` → Alert nurse/admin

---

## New Patient Intake Flow

**Step 1: Identity**
> "Great! I'll help you get everything ready. First, what's your first and last name?"

[Capture name via speech-to-text]

> "And your date of birth?"

[Capture DOB, format: MM/DD/YYYY]

**Step 2: Language Preference**
> "Would you like to continue in English or Spanish? Say 'English' or 'Español.'"

[If Spanish selected, switch to Spanish script]

**Step 3: Consent (Voice)**
> "I'll read a brief privacy notice. This notice explains how we protect your health information under HIPAA."
>
> [Read abbreviated NPP or direct to full PDF]
>
> "Do you acknowledge this notice and agree to continue? Say 'I agree' or 'I do not agree.'"

**If AGREE:**
- Record acceptance with timestamp + call SID
- Store consent in database

**If DISAGREE:**
> "No problem. We can't continue without consent, but you're welcome to complete intake in person. Would you like to schedule an appointment?"

**Step 4: Magic Link Offer**
> "Perfect! I'll send a secure link to your phone or email so you can upload your insurance card and complete the rest at your convenience."
>
> "What's the best phone number or email for you?"

[Capture contact]

> "Done! Check your messages in the next minute. Prefer to keep going by voice? Say 'continue by voice.'"

**If voice:**
- Continue with coverage Q&A (member ID, payer, etc.)
- Flag for staff to call back for document collection

**If link:**
- Send SMS/email with magic link
- End call gracefully

---

## Appointment Scheduling (Phase 2)

> "I can check availability for you. What type of visit? For example, annual physical, new patient consultation, or follow-up?"

[Use EHR scheduling API to present slots]

> "I have these times available: [list 2-3 slots]. Which works for you?"

---

## Billing / Insurance Questions

> "For billing questions, I can connect you with our team. They're available Monday through Friday, 9 to 5. Should I transfer you, or can I help with something else?"

---

## Pharmacy Information

> "Our preferred pharmacy partners are [list]. You can also choose your own. I'll ask about your pharmacy preference during intake."

---

## Ending the Call

> "Thanks for calling IntakePal! We'll see you soon. If you need anything before your visit, just call back. Take care!"

---

## Error Handling

**Speech not recognized:**
> "Hmm, I didn't catch that. Could you repeat it, or press 0 to speak with our team?"

**Technical issue:**
> "I'm having a little trouble. Let me connect you with someone who can help. Please hold."

---

## Compliance Notes

- **Recording Disclosure:** "This call may be recorded for quality and training."
- **TCPA Consent:** Captured separately during intake consent step.
- **HIPAA:** No PHI is read aloud except what patient provides; transcripts redacted before any model use.
- **Audit:** Every voice consent logged with call SID, timestamp, and hash.
