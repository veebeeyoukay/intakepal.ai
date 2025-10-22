# IntakePal Q&A Knowledge Base
## For Lindy.ai Agent - Frequently Asked Questions

**Version**: 1.0
**Last Updated**: October 2025
**Purpose**: Structured question-answer pairs for common patient inquiries.

---

## How to Use This Knowledge Base

**For Lindy.ai Agent**:
- Match caller's question to category using keywords
- Provide the scripted answer exactly as written
- After answering, always ask: "Is there anything else I can help with?"
- If question isn't found here, transfer to appropriate human staff

**Answer Format**:
- Clear, concise, friendly
- Include actionable next steps when applicable
- Mention phone numbers, URLs, or resources when relevant

---

## CATEGORY 1: PRACTICE INFORMATION

### Q1.1: What are your office hours?

**Keywords**: hours, open, closed, when, schedule

**Answer**:
```
Our office hours are:
• Monday through Friday: 8 AM to 5 PM
• Saturday: 9 AM to 1 PM (check practice-specific config)
• Sunday: Closed

For after-hours emergencies, you can reach our on-call provider
at [ON_CALL_NUMBER].

Is there anything else I can help with?
```

**Variables**: `[ON_CALL_NUMBER]` from config

---

### Q1.2: Where are you located?

**Keywords**: location, address, where, directions, find

**Answer**:
```
We're located at [PRACTICE_ADDRESS].

Parking: [PARKING_INFO] (if available in config)

If you'd like, I can text you a map link to make it easier to find us.
Would that be helpful?
```

**Variables**:
- `[PRACTICE_ADDRESS]` from config
- `[PARKING_INFO]` from config (optional)

**Follow-up Action**: If caller says yes, send Google Maps link via SMS

---

### Q1.3: How do I contact you?

**Keywords**: contact, phone number, email, reach

**Answer**:
```
You can reach us:
• Phone: [MAIN_PHONE_NUMBER]
• Email: [PRACTICE_EMAIL] (for non-urgent questions)
• Patient Portal: [PORTAL_URL] (for secure messages to your provider)

For new patient registration and appointment scheduling, I can help
you right now if you'd like!

What works best for you?
```

**Variables**: `[MAIN_PHONE_NUMBER]`, `[PRACTICE_EMAIL]`, `[PORTAL_URL]`

---

### Q1.4: Do you have weekend or evening appointments?

**Keywords**: weekend, Saturday, evening, late, after hours

**Answer**:
```
We offer Saturday appointments from 9 AM to 1 PM (check practice schedule).

For evening appointments, availability varies by provider. Let me
check our scheduling system for you.

Are you looking for a specific day or time that works better for your schedule?
```

**Action**: Transfer to scheduling team or check availability if system integrated

---

## CATEGORY 2: INSURANCE & BILLING

### Q2.1: Do you accept my insurance?

**Keywords**: insurance, accept, take, plan, coverage, network, in-network

**Answer**:
```
We work with most major insurance plans, including:
• Medicare and Medicaid
• Blue Cross Blue Shield
• Aetna
• UnitedHealthcare
• Cigna
• Humana
• And many others

The best way to verify your specific coverage is to provide your
insurance information when you complete intake online. Our system
will verify your eligibility automatically.

You can also call your insurance company and ask if [PRACTICE_NAME]
is in your network.

Would you like me to send you the intake link to verify your coverage?
```

**Variables**: `[PRACTICE_NAME]`

---

### Q2.2: How much will my visit cost?

**Keywords**: cost, price, how much, pay, payment, charge

**Answer**:
```
Costs depend on:
• Your insurance coverage (copay, deductible, coinsurance)
• The type of visit (annual physical, sick visit, procedure)
• Services provided during your appointment

For the most accurate estimate, our billing team can help if you provide:
• Your insurance information
• The type of appointment you need

Would you like me to transfer you to our billing team? They're available
Monday through Friday, 9 AM to 5 PM.
```

---

### Q2.3: Do you offer payment plans?

**Keywords**: payment plan, financing, afford, installment, owe

**Answer**:
```
Yes, we offer payment plans for patients who need them.

Our billing team can discuss:
• Monthly payment options
• Interest-free payment plans (if available)
• Financial assistance programs

Would you like me to connect you with our billing department?
They're available Monday through Friday, 9 AM to 5 PM at [BILLING_PHONE_NUMBER].
```

**Variables**: `[BILLING_PHONE_NUMBER]`

---

### Q2.4: I have a question about my bill

**Keywords**: bill, statement, charged, billing question, invoice

**Answer**:
```
I understand. Our billing team is best equipped to look up your
specific statement and answer questions about charges.

They're available:
• Monday through Friday: 9 AM to 5 PM
• Phone: [BILLING_PHONE_NUMBER]
• Email: [BILLING_EMAIL]

Would you like me to transfer you now, or would you prefer to
call back during those hours?
```

**Variables**: `[BILLING_PHONE_NUMBER]`, `[BILLING_EMAIL]`

**Action**: Transfer to billing if caller requests

---

### Q2.5: Do you accept Medicare/Medicaid?

**Keywords**: Medicare, Medicaid, government insurance

**Answer**:
```
Yes, we accept both Medicare and Medicaid.

For Medicare patients:
• We accept Medicare Part B for office visits
• Some services may require prior authorization
• Your Medicare card and photo ID are required at your visit

For Medicaid patients:
• We accept [STATE] Medicaid
• Please bring your Medicaid card to your appointment
• Some managed care plans may have different requirements

Would you like to schedule an appointment?
```

**Variables**: `[STATE]` from practice config

---

## CATEGORY 3: APPOINTMENTS

### Q3.1: How do I schedule an appointment?

**Keywords**: schedule, book, appointment, make appointment

**Answer**:
```
I can help you schedule an appointment right now!

Are you a new patient, or have you been seen at [PRACTICE_NAME] before?
```

**Action**: Route to State 4 (Appointment Scheduling Flow)

---

### Q3.2: How do I cancel or reschedule my appointment?

**Keywords**: cancel, reschedule, change, move appointment

**Answer**:
```
To cancel or reschedule your appointment, I'll need to verify your identity first.

Can I get your full name and date of birth?
```

**Action**:
1. Collect name + DOB
2. Look up patient
3. Transfer to scheduling team with context OR
4. If system integrated, allow agent to cancel/reschedule directly

**Note**: Cancellation policy should be mentioned:
```
Our cancellation policy requires 24 hours notice. If you cancel within
24 hours, there may be a fee. Would you still like to cancel?
```

---

### Q3.3: What should I bring to my appointment?

**Keywords**: bring, need, what to bring, documents

**Answer**:
```
Please bring:
• Photo ID (driver's license, passport, etc.)
• Insurance card (both sides)
• List of current medications (or bring the bottles)
• Pharmacy information (name, address, phone)
• Any medical records from other providers (if applicable)
• Copay payment (if your insurance requires one)

For new patients, you'll also complete intake online before your visit,
which will save you time at the office.

Would you like me to send you the intake link now?
```

---

### Q3.4: How early should I arrive?

**Keywords**: early, arrive, check in, check-in time

**Answer**:
```
For new patients: Please arrive 15 minutes before your scheduled time
to complete check-in (if you've already completed online intake).

For established patients: Please arrive 10 minutes early for check-in.

If you haven't completed your online intake yet, please arrive 20-30
minutes early, or complete it before your visit using the link we'll
send you.

Would you like me to send you the intake link now?
```

---

### Q3.5: Can I see a specific doctor?

**Keywords**: specific doctor, certain provider, Dr. [name], request

**Answer**:
```
Absolutely! You can request [PROVIDER_NAME] when scheduling your appointment.

Let me check [his/her/their] availability for you.

What type of visit do you need?
```

**Action**: Check provider-specific availability or transfer to scheduling

---

### Q3.6: Do you offer telehealth / virtual visits?

**Keywords**: telehealth, virtual, video visit, online appointment, remote

**Answer**:
```
Yes, we offer telehealth appointments for certain types of visits.

Telehealth is available for:
• Follow-up appointments
• Medication management
• Some consultation visits
• Minor concerns that don't require a physical exam

Telehealth is NOT available for:
• Initial new patient visits (must be in-person)
• Physical exams
• Procedures
• Most diagnostic testing

Would you like to schedule a telehealth appointment, or would an
in-person visit work better for you?
```

**Action**: Route to appointment scheduling with telehealth preference noted

---

## CATEGORY 4: PATIENT PORTAL

### Q4.1: How do I access the patient portal?

**Keywords**: portal, login, access, sign in, account

**Answer**:
```
Our patient portal is available 24/7 at [PORTAL_URL].

If this is your first time:
1. Go to [PORTAL_URL]
2. Click "First Time User" or "Register"
3. Enter your name, date of birth, and email
4. Create a password
5. You're all set!

Through the portal you can:
• View test results
• Message your provider
• Request prescription refills
• View upcoming appointments
• Update your information

Would you like me to text or email you the portal link?
```

**Variables**: `[PORTAL_URL]`

**Follow-up**: If yes, collect contact info and send link

---

### Q4.2: I forgot my portal password

**Keywords**: forgot password, reset password, can't log in, locked out

**Answer**:
```
No problem! To reset your password:

1. Go to [PORTAL_URL]
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for a reset link
5. Follow the link to create a new password

If you're still having trouble, our IT support team can help:
• Phone: [SUPPORT_PHONE]
• Email: [SUPPORT_EMAIL]
• Available: [SUPPORT_HOURS]

Is there anything else I can help with?
```

**Variables**: `[PORTAL_URL]`, `[SUPPORT_PHONE]`, `[SUPPORT_EMAIL]`, `[SUPPORT_HOURS]`

---

### Q4.3: How do I view my test results?

**Keywords**: test results, lab results, results ready, bloodwork

**Answer**:
```
Test results are posted to your patient portal as soon as they're
available and reviewed by your provider.

To view your results:
1. Log in to the patient portal at [PORTAL_URL]
2. Click "Test Results" or "Lab Results"
3. You'll see all available results with dates

Your provider will reach out if there's anything abnormal that
requires follow-up.

If you're waiting for time-sensitive results and need to speak
with someone, I can transfer you to our clinical team.

Would you like me to do that?
```

**Variables**: `[PORTAL_URL]`

**Action**: Transfer to clinical team if urgent

---

### Q4.4: How do I send a message to my doctor?

**Keywords**: message, email doctor, contact provider, send message

**Answer**:
```
You can send a secure message to your provider through the patient portal.

Steps:
1. Log in to [PORTAL_URL]
2. Click "Messages" or "Contact Provider"
3. Select your provider from the list
4. Type your message
5. Click "Send"

Your provider or care team typically responds within 1-2 business days.

For urgent medical issues, please call the office or use the
after-hours line instead of sending a portal message.

Is there anything else I can help with?
```

**Variables**: `[PORTAL_URL]`

---

## CATEGORY 5: PRESCRIPTIONS & PHARMACY

### Q5.1: How do I get a prescription refill?

**Keywords**: refill, prescription, medication, renew, out of meds

**Answer**:
```
To request a prescription refill:

Option 1 - Through Your Pharmacy (fastest):
• Call your pharmacy and request the refill
• They'll contact us directly

Option 2 - Through Patient Portal:
• Log in to [PORTAL_URL]
• Go to "Medications" or "Refill Requests"
• Select the medication and click "Request Refill"

Option 3 - Call Our Office:
• Leave a message with:
  - Your name and date of birth
  - Medication name and dosage
  - Pharmacy name and phone number

Refills are typically processed within 1-2 business days.

Which option works best for you?
```

**Variables**: `[PORTAL_URL]`

---

### Q5.2: Can you send my prescription to a different pharmacy?

**Keywords**: change pharmacy, different pharmacy, transfer prescription

**Answer**:
```
Yes, we can send your prescription to a different pharmacy.

To request this:
1. Call the new pharmacy and provide:
   • Your name and date of birth
   • The medication you need transferred
   • Our office name and phone number

2. The new pharmacy will contact us to transfer the prescription

OR

Send a message through the patient portal at [PORTAL_URL] with:
   • The medication name
   • New pharmacy name, address, and phone number

Is there anything else I can help with?
```

**Variables**: `[PORTAL_URL]`

---

### Q5.3: I need a new prescription

**Keywords**: new prescription, prescribe, need medication, doctor prescribe

**Answer**:
```
For new prescriptions, you'll need to speak with your provider.

If you have an upcoming appointment, you can discuss it then.

If you don't have an appointment scheduled, or if this is urgent,
I can:
• Help you schedule an appointment
• Connect you with our nurse line to assess urgency
• Set up a telehealth visit (if appropriate)

What works best for you?
```

**Action**: Route based on caller's preference

---

### Q5.4: What pharmacy do you work with?

**Keywords**: pharmacy, preferred pharmacy, which pharmacy

**Answer**:
```
We work with most pharmacies. Our preferred partners are:
• Walgreens Pharmacy
• CVS Pharmacy
• Publix Pharmacy

But you're welcome to use any pharmacy you prefer—just let us know
which one during your intake or at your visit.

For specialty medications, we also work with specialty pharmacies
as needed.

Is there anything else I can help with?
```

---

## CATEGORY 6: NEW PATIENT REGISTRATION

### Q6.1: I'm a new patient. How do I register?

**Keywords**: new patient, register, first visit, first time, sign up

**Answer**:
```
Welcome! I can help you register right now.

Here's how it works:
1. I'll ask a few quick questions (name, date of birth, etc.)
2. I'll send you a secure link to your phone or email
3. You'll upload your insurance card and complete a health questionnaire
4. The whole process takes about 5 minutes

Ready to get started?
```

**Action**: Route to State 3 (New Patient Intake Flow)

---

### Q6.2: Do I need a referral?

**Keywords**: referral, need referral, require referral

**Answer**:
```
It depends on your insurance plan.

Some insurance plans (especially HMOs) require a referral from your
primary care doctor for specialty visits.

PPO and Medicare plans typically don't require referrals.

The best way to know for sure:
• Check with your insurance company
• Or provide your insurance info during intake, and we'll verify
  your coverage requirements automatically

Would you like me to send you the intake link so we can check
your insurance requirements?
```

---

### Q6.3: How long does registration take?

**Keywords**: how long, time, duration, quick

**Answer**:
```
The online intake process takes about 5-7 minutes.

You'll need:
• Your insurance card (front and back)
• List of current medications
• Your pharmacy information
• A few minutes to answer health history questions

You can complete it on your phone, tablet, or computer—whatever
is most convenient for you.

If you'd prefer to complete everything in person, you can arrive
30 minutes early to your first appointment and our staff will help you.

Which would you prefer?
```

---

### Q6.4: What if I don't have insurance?

**Keywords**: no insurance, uninsured, self-pay, cash

**Answer**:
```
We welcome patients without insurance!

For self-pay patients:
• We offer discounted cash rates
• Payment is expected at the time of service
• We can provide a receipt for you to submit to insurance later (if applicable)

For information about:
• Self-pay rates for specific services
• Payment plans
• Financial assistance programs

I can connect you with our billing team at [BILLING_PHONE_NUMBER].

Would you like me to transfer you, or would you like to proceed
with registration for now?
```

**Variables**: `[BILLING_PHONE_NUMBER]`

---

## CATEGORY 7: SPECIALTY-SPECIFIC (OB-GYN)

### Q7.1 (OB-GYN): Am I pregnant? / I think I'm pregnant

**Keywords**: pregnant, pregnancy test, think I'm pregnant, late period

**Answer**:
```
I can't diagnose pregnancy over the phone, but we can definitely help
you find out!

We offer:
• Pregnancy confirmation visits (urine and/or blood test)
• First prenatal visit if you're already confirmed pregnant
• Contraception counseling if you're trying to prevent pregnancy

Would you like to schedule a pregnancy confirmation appointment?
```

**Action**: Route to appointment scheduling

**EMERGENCY CHECK**: If caller mentions severe pain, bleeding, or other symptoms, route to clinical assessment immediately

---

### Q7.2 (OB-GYN): I'm pregnant. When should I schedule my first appointment?

**Keywords**: pregnant, first OB appointment, prenatal, first visit

**Answer**:
```
Congratulations!

For your first prenatal visit, we typically schedule between 8-10 weeks
of pregnancy (counting from your last menstrual period).

If you already know you're pregnant and know your due date or how far
along you are, I can help you schedule your first appointment now.

If you're not sure and need a pregnancy confirmation first, we can
schedule that instead.

Which applies to you?
```

**Action**: Route to appointment scheduling with appropriate visit type

---

### Q7.3 (OB-GYN): I need birth control

**Keywords**: birth control, contraception, prevent pregnancy, pill, IUD

**Answer**:
```
We offer several birth control options, including:
• Birth control pills
• IUDs (hormonal and non-hormonal)
• Implants
• Injections
• Patches and rings
• Barrier methods

To discuss which option is right for you and your health history,
you'll need a consultation with one of our providers.

Would you like to schedule a contraception consultation appointment?
```

**Action**: Route to appointment scheduling, type: "contraception consultation"

---

### Q7.4 (OB-GYN): When is my annual well-woman exam due?

**Keywords**: annual exam, pap smear, well-woman, checkup, screening

**Answer**:
```
Annual well-woman exams typically include:
• Pelvic exam
• Breast exam
• Pap smear (if due - typically every 3 years for ages 21-65)
• Screening for infections
• Contraception counseling (if needed)

To check when your last exam was and schedule your next one, I'll need
to verify your identity and look up your record.

Can I get your full name and date of birth?
```

**Action**: Verify identity → Look up last visit → Schedule if due

---

### Q7.5 (OB-GYN): I'm having heavy bleeding / severe pain (EMERGENCY)

**Keywords**: heavy bleeding, severe bleeding, severe pain, emergency

**IMMEDIATE EMERGENCY PROTOCOL**:
```
It sounds like you may need immediate care.

If you're experiencing:
• Heavy bleeding that soaks through a pad in an hour or less
• Severe abdominal or pelvic pain
• Dizziness or fainting
• Fever with pain

Please hang up and dial 9-1-1 or go to the nearest emergency room.

If this is less urgent but still concerning, I can connect you with
our nurse line right away for assessment.

Which is more appropriate for your situation?
```

**Action**:
- If emergency → Reinforce 911 and end call
- If urgent → Transfer to nurse line immediately
- Log emergency keyword detected

---

## CATEGORY 8: SPECIALTY-SPECIFIC (PODIATRY)

### Q8.1 (Podiatry): I have an ingrown toenail

**Keywords**: ingrown toenail, toenail, nail problem

**Answer**:
```
Ingrown toenails can definitely be painful, and we can help!

If you're experiencing:
• Severe pain
• Redness or swelling
• Signs of infection (pus, red streaks, warmth)

We may be able to see you sooner as an urgent visit.

Otherwise, we can schedule a regular appointment for evaluation
and treatment.

Which describes your situation better?
```

**Action**: Route to appointment scheduling with urgency noted

**EMERGENCY CHECK**: If diabetic patient mentions foot infection → immediate nurse transfer

---

### Q8.2 (Podiatry): I'm diabetic and have a foot wound (EMERGENCY)

**Keywords**: diabetic + foot wound, diabetic + infection, diabetic + sore

**IMMEDIATE CLINICAL TRANSFER**:
```
For diabetic patients with foot wounds or infections, we need to
have our clinical team assess this right away to determine how
urgently you need to be seen.

Let me connect you with our nurse line now. Please hold for just
a moment.
```

**Action**: Transfer to nurse/clinical line IMMEDIATELY
**Log**: Emergency - diabetic foot wound, immediate transfer

---

### Q8.3 (Podiatry): I need custom orthotics / shoe inserts

**Keywords**: orthotics, custom inserts, shoe inserts, arch support

**Answer**:
```
We offer custom orthotics and can help with arch support issues!

To get fitted for orthotics, you'll need an initial evaluation
appointment where we'll:
• Assess your feet and gait
• Take measurements or molds
• Discuss your specific needs and activities
• Provide recommendations

Custom orthotics typically take 2-3 weeks to manufacture after
your fitting appointment.

Would you like to schedule an orthotics evaluation?
```

**Action**: Route to appointment scheduling, type: "orthotics evaluation"

---

### Q8.4 (Podiatry): I have heel pain / plantar fasciitis

**Keywords**: heel pain, plantar fasciitis, bottom of foot pain

**Answer**:
```
Heel pain and plantar fasciitis are very common, and we can definitely
help with treatment options.

We offer:
• Evaluation and diagnosis
• Custom orthotics
• Stretching and exercise guidance
• Injection therapy (if needed)
• Other treatment modalities

To determine the best treatment for you, you'll need an evaluation
appointment with one of our podiatrists.

Would you like to schedule an appointment?
```

**Action**: Route to appointment scheduling

---

### Q8.5 (Podiatry): I have a bunion / hammertoe

**Keywords**: bunion, hammertoe, toe deformity, crooked toe

**Answer**:
```
We treat bunions and hammertoes with both conservative and surgical options.

Treatment options include:
• Custom orthotics to slow progression
• Padding and shoe modifications
• Pain management
• Surgical correction (if conservative treatment fails)

To discuss which option is right for you, you'll need an evaluation
appointment.

Would you like to schedule that?
```

**Action**: Route to appointment scheduling

---

## CATEGORY 9: COVID-19 & ILLNESS

### Q9.1: Do you test for COVID-19?

**Keywords**: COVID test, coronavirus test, COVID-19

**Answer**:
```
[Check practice policy and update accordingly]

Example:
"Yes, we offer COVID-19 testing for symptomatic patients.

If you're experiencing COVID symptoms (fever, cough, loss of taste/smell),
please call us before coming to the office so we can arrange appropriate
precautions.

Would you like to schedule a sick visit for evaluation and testing?"
```

**Action**: Route to sick visit appointment OR provide testing instructions per practice policy

---

### Q9.2: What are your COVID safety protocols?

**Keywords**: COVID safety, mask, precautions, safe, protocols

**Answer**:
```
[Update based on current practice policy]

Example:
"Your safety is our priority. Our current protocols include:
• Enhanced cleaning and sanitization
• HEPA air filtration in all rooms
• Hand sanitizer stations throughout the office
• Social distancing in waiting areas
• Masks [required/optional/available upon request]

If you have any COVID symptoms, please let us know before your
visit so we can take appropriate precautions.

Is there anything else I can help with?"
```

---

### Q9.3: I'm sick. Can I be seen today?

**Keywords**: sick, today, same day, urgent, as soon as possible

**Answer**:
```
I understand you're not feeling well. Let me see what we can do.

What symptoms are you experiencing?
```

**Action**:
1. Listen to symptoms
2. Check for emergency keywords (chest pain, trouble breathing, etc.)
3. If emergency → Route to 911
4. If urgent but not emergency → Check same-day availability or transfer to nurse
5. If non-urgent → Schedule regular appointment

---

## CATEGORY 10: FORMS & PAPERWORK

### Q10.1: I need a form filled out (FMLA, disability, etc.)

**Keywords**: form, paperwork, FMLA, disability, work note, school note

**Answer**:
```
We can help with medical forms and documentation.

For forms that require provider signature (FMLA, disability, work/school notes):
• Please submit the form through the patient portal or bring it to your
  next appointment
• Processing typically takes 3-5 business days
• There may be a fee for certain forms (check with billing)

For simple work/school notes:
• Can usually be provided at your visit

Would you like me to send you instructions for submitting forms
through the portal?
```

---

### Q10.2: How do I get my medical records?

**Keywords**: medical records, records request, copy of records

**Answer**:
```
To request copies of your medical records:

Option 1 - Patient Portal (fastest):
• Log in to [PORTAL_URL]
• Go to "Medical Records" or "Health Information"
• Download/print what you need

Option 2 - Formal Request:
• Complete a medical records release form
• Submit via portal, email to [RECORDS_EMAIL], or in person
• Processing takes 5-10 business days
• There may be a fee for paper copies

Are you looking for your full records, or just specific items
like test results or visit summaries?
```

**Variables**: `[PORTAL_URL]`, `[RECORDS_EMAIL]`

---

## CATEGORY 11: BILLING & PAYMENTS

### Q11.1: What payment methods do you accept?

**Keywords**: payment methods, how to pay, accept credit cards, cash

**Answer**:
```
We accept:
• Cash
• Credit cards (Visa, Mastercard, American Express, Discover)
• Debit cards
• Checks (with valid ID)
• HSA/FSA cards
• Online payments through the patient portal

Payment is typically due at the time of service for copays and
self-pay patients.

For questions about payment plans or financial assistance, our
billing team can help at [BILLING_PHONE_NUMBER].

Is there anything else I can help with?
```

**Variables**: `[BILLING_PHONE_NUMBER]`

---

### Q11.2: Do you offer financial assistance?

**Keywords**: financial assistance, can't afford, help paying, hardship

**Answer**:
```
Yes, we want to help make care accessible.

We offer:
• Payment plans (interest-free options available)
• Self-pay discounts
• Financial assistance for qualifying patients

Our billing team can discuss your situation confidentially and
help you find a solution.

Would you like me to connect you with them now? They're available
Monday through Friday, 9 AM to 5 PM at [BILLING_PHONE_NUMBER].
```

**Variables**: `[BILLING_PHONE_NUMBER]`

---

## CATEGORY 12: MISCELLANEOUS

### Q12.1: Can my family member call on my behalf?

**Keywords**: family member, call for, on behalf of, spouse, parent

**Answer**:
```
Due to HIPAA privacy laws, we can only discuss your medical information
with people you've authorized.

To authorize someone:
• Complete a HIPAA authorization form
• Available through the patient portal at [PORTAL_URL]
• Or request one at your next visit

Once the authorization is on file, we can speak with that person
about your care.

Is this regarding scheduling an appointment, or do they need access
to medical information?
```

**Variables**: `[PORTAL_URL]`

**Note**: Can schedule appointments without authorization, but cannot discuss medical info

---

### Q12.2: I have a complaint / I'm unhappy with my care

**Keywords**: complaint, unhappy, dissatisfied, poor service, rude

**Answer**:
```
I'm really sorry you've had a negative experience. We take all
feedback seriously and want to make this right.

Let me connect you with our practice manager who can listen to
your concerns and help resolve the issue.

Can I get your name first so I can let them know you're calling?
```

**Action**: Transfer to practice manager or designated patient relations staff
**Log**: Patient complaint, transfer to manager

---

### Q12.3: Are you accepting new patients?

**Keywords**: accepting new patients, taking new patients, new patient capacity

**Answer**:
```
Yes, we are currently accepting new patients!

I can help you get registered and scheduled right now if you'd like.

Are you ready to get started, or do you have questions first?
```

**Action**: Route to new patient registration flow

---

### Q12.4: Do you accept walk-ins?

**Keywords**: walk-in, no appointment, without appointment

**Answer**:
```
[Update based on practice policy]

Example:
"We operate primarily by appointment to minimize wait times and
ensure you get the time you need with your provider.

However, for urgent issues, we may be able to work you in if we
have availability. Please call ahead so we can let you know if
we can accommodate you.

Would you like to schedule an appointment now, or is this an
urgent issue where you need to be seen today?"
```

---

### Q12.5: Can I bring my child / family member to my appointment?

**Keywords**: bring child, bring family, accompany, someone with me

**Answer**:
```
Yes, you're welcome to bring someone with you to your appointment.

Please note:
• For children: We ask that children be supervised at all times
  for safety reasons
• For support persons: You can have one support person in the exam
  room with you
• For COVID precautions: [Update based on current policy]

Is there anything else I can help with?
```

---

## HANDLING UNKNOWN QUESTIONS

**If a question is NOT in this knowledge base**:

```
That's a great question. Let me connect you with our team who can
give you the most accurate information about that.

[Determine appropriate transfer destination]:
• Clinical questions → Nurse line
• Administrative questions → Front desk
• Billing questions → Billing team
• Technical/portal questions → IT support

One moment please, I'm transferring you now.
```

**Always log**: Unknown question, [question text], transferred to [destination]

---

## UPDATING THIS KNOWLEDGE BASE

**When to Update**:
- New common questions emerge from call logs
- Practice policies change
- New services are offered
- Phone numbers, hours, or contact info changes
- Seasonal information (flu shots, holiday hours, etc.)

**Version Control**:
- Update version number with each change
- Note date of update
- Document what changed in version history section

---

**END OF Q&A KNOWLEDGE BASE**

**Version**: 1.0
**Last Updated**: October 2025
**Total Q&A Pairs**: 60+
**For**: Lindy.ai Voice Agent Integration
**Support**: support@intakepal.ai
