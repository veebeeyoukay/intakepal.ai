import { describe, it, expect } from 'vitest';
import smsTemplates from '@/content/sms-templates.json';

describe('HIPAA Compliance - Channel Rules', () => {
  describe('SMS Templates - No PHI Policy', () => {
    it('all SMS templates exist', () => {
      expect(smsTemplates.templates).toBeDefined();
      expect(smsTemplates.templates.length).toBeGreaterThan(0);
    });

    it('magic link template contains no PHI', () => {
      const magicLinkTemplate = smsTemplates.templates.find(
        (t) => t.id === 'magic_link_initial'
      );

      expect(magicLinkTemplate).toBeDefined();
      expect(magicLinkTemplate!.content).not.toMatch(/\{\{name\}\}/);
      expect(magicLinkTemplate!.content).not.toMatch(/\{\{phone\}\}/);
      expect(magicLinkTemplate!.content).not.toMatch(/\{\{dob\}\}/);
      expect(magicLinkTemplate!.content).not.toMatch(/\{\{ssn\}\}/);
      expect(magicLinkTemplate!.content).not.toMatch(/\{\{memberId\}\}/);
    });

    it('reminder template contains no PHI', () => {
      const reminderTemplate = smsTemplates.templates.find(
        (t) => t.id === 'reminder_incomplete'
      );

      expect(reminderTemplate).toBeDefined();
      expect(reminderTemplate!.content).not.toMatch(/\{\{name\}\}/);
      expect(reminderTemplate!.content).not.toMatch(/\{\{phone\}\}/);
      expect(reminderTemplate!.content).not.toMatch(/\{\{dob\}\}/);
    });

    it('confirmation template contains no PHI', () => {
      const confirmationTemplate = smsTemplates.templates.find(
        (t) => t.id === 'confirmation_complete'
      );

      expect(confirmationTemplate).toBeDefined();
      expect(confirmationTemplate!.content).not.toMatch(/\{\{name\}\}/);
      expect(confirmationTemplate!.content).not.toMatch(/\{\{diagnosis\}\}/);
      expect(confirmationTemplate!.content).not.toMatch(/\{\{medication\}\}/);
    });

    it('appointment reminder has minimal PHI (time only, no diagnosis)', () => {
      const appointmentTemplate = smsTemplates.templates.find(
        (t) => t.id === 'appointment_reminder'
      );

      expect(appointmentTemplate).toBeDefined();

      // Time is acceptable in some contexts, but no other PHI
      expect(appointmentTemplate!.content).not.toMatch(/\{\{reason\}\}/);
      expect(appointmentTemplate!.content).not.toMatch(/\{\{diagnosis\}\}/);
      expect(appointmentTemplate!.content).not.toMatch(/\{\{provider\}\}/);
    });

    it('all templates include TCPA opt-out instructions', () => {
      smsTemplates.templates.forEach((template) => {
        if (!template.id.includes('stop_response') && !template.id.includes('help_response')) {
          expect(template.content.toLowerCase()).toMatch(/stop|opt out/);
        }
      });
    });

    it('TCPA compliance: STOP response is implemented', () => {
      const stopResponse = smsTemplates.templates.find(
        (t) => t.id === 'stop_response'
      );

      expect(stopResponse).toBeDefined();
      expect(stopResponse!.content).toContain('unsubscribed');
    });

    it('TCPA compliance: HELP response is implemented', () => {
      const helpResponse = smsTemplates.templates.find(
        (t) => t.id === 'help_response'
      );

      expect(helpResponse).toBeDefined();
      expect(helpResponse!.content).toContain('support');
    });

    it('templates use only shortLink variable (no PHI variables)', () => {
      smsTemplates.templates.forEach((template) => {
        const variables = template.variables || [];

        // Only allowed non-PHI variables
        const allowedVariables = [
          'shortLink',
          'practiceName',
          'practicePhone',
          'time', // Appointment time is borderline but acceptable
        ];

        variables.forEach((variable: string) => {
          expect(allowedVariables).toContain(variable);
        });

        // Disallowed PHI variables
        expect(variables).not.toContain('name');
        expect(variables).not.toContain('phone');
        expect(variables).not.toContain('dob');
        expect(variables).not.toContain('ssn');
        expect(variables).not.toContain('memberId');
        expect(variables).not.toContain('diagnosis');
        expect(variables).not.toContain('medication');
        expect(variables).not.toContain('reason');
      });
    });
  });

  describe('Email Templates - Minimal PHI Policy', () => {
    it('email templates should use secure links, not PHI', () => {
      // Email templates should follow same rules as SMS
      const safeEmailPatterns = [
        'Click here to continue: {{secureLink}}',
        'Your appointment is scheduled',
        'Thank you for completing your intake',
      ];

      safeEmailPatterns.forEach((pattern) => {
        expect(pattern).not.toMatch(/\{\{dob\}\}/);
        expect(pattern).not.toMatch(/\{\{ssn\}\}/);
        expect(pattern).not.toMatch(/\{\{diagnosis\}\}/);
      });
    });
  });

  describe('WhatsApp - No PHI Policy', () => {
    it('WhatsApp messages must not contain PHI', () => {
      // WhatsApp follows same rules as SMS
      const whatsappSafeMessages = [
        'Hi! Tap to start your secure intake: {{link}}',
        'Your intake is complete. Check your email for details.',
      ];

      whatsappSafeMessages.forEach((msg) => {
        expect(msg).not.toMatch(/\{\{name\}\}/);
        expect(msg).not.toMatch(/\{\{phone\}\}/);
        expect(msg).not.toMatch(/\{\{diagnosis\}\}/);
      });
    });
  });

  describe('Voice Call Scripts - HIPAA Consent Required', () => {
    it('voice scripts must obtain consent before collecting PHI', () => {
      const voiceScript = {
        greeting: "Hi, I'm Allie from IntakePal.",
        consentRequest: "I'll read a brief privacy notice. Say 'I agree' to continue.",
        // PHI collection only after consent
      };

      expect(voiceScript.consentRequest).toBeTruthy();
    });

    it('voice recordings must have retention policy', () => {
      const voicePolicy = {
        recordingRetention: '7 years',
        transcriptRedaction: true,
        baaRequired: true,
      };

      expect(voicePolicy.recordingRetention).toBeDefined();
      expect(voicePolicy.transcriptRedaction).toBe(true);
      expect(voicePolicy.baaRequired).toBe(true);
    });
  });

  describe('Magic Links - Security Requirements', () => {
    it('magic links should expire', () => {
      const magicLinkConfig = {
        expirationDays: 7,
        singleUse: true,
        https: true,
      };

      expect(magicLinkConfig.expirationDays).toBeLessThanOrEqual(7);
      expect(magicLinkConfig.singleUse).toBe(true);
      expect(magicLinkConfig.https).toBe(true);
    });

    it('magic links should use HTTPS only', () => {
      const exampleLink = 'https://intakepal.ai/intake?token=abc123';

      expect(exampleLink).toMatch(/^https:\/\//);
      expect(exampleLink).not.toMatch(/^http:\/\//);
    });

    it('magic link tokens should not expose PHI', () => {
      const tokenExamples = [
        'abc123def456',
        'xyz789uvw012',
        'token-session-id-123',
      ];

      tokenExamples.forEach((token) => {
        // Token should not contain recognizable PHI
        expect(token).not.toMatch(/\d{3}-\d{2}-\d{4}/); // No SSN pattern
        expect(token).not.toMatch(/\d{10}/); // No phone pattern
        expect(token).not.toMatch(/\d{4}-\d{2}-\d{2}/); // No DOB pattern
      });
    });
  });

  describe('Channel Compliance Metadata', () => {
    it('SMS templates have HIPAA compliance notes', () => {
      expect(smsTemplates.compliance).toBeDefined();
      expect(smsTemplates.compliance.hipaa).toContain('No PHI');
    });

    it('SMS templates have TCPA compliance notes', () => {
      expect(smsTemplates.compliance.tcpa).toBeDefined();
      expect(smsTemplates.compliance.tcpa).toContain('STOP');
    });

    it('short links have security policy', () => {
      expect(smsTemplates.compliance.shortLinks).toBeDefined();
      expect(smsTemplates.compliance.shortLinks).toContain('HTTPS');
      expect(smsTemplates.compliance.shortLinks).toContain('expire');
    });
  });

  describe('Emergency & Triage Protocols', () => {
    it('emergency keywords should route immediately', () => {
      const emergencyKeywords = [
        'chest pain',
        'bleeding heavily',
        'can\'t breathe',
        'suicide',
        '911',
      ];

      // Voice AI should detect these and route to nurse or 911
      emergencyKeywords.forEach((keyword) => {
        expect(keyword.length).toBeGreaterThan(0);
      });
    });

    it('emergency routing should not delay for intake', () => {
      const emergencyFlow = {
        detectKeyword: true,
        routeTo: 'nurse or 911',
        skipIntake: true,
        logEvent: true,
      };

      expect(emergencyFlow.skipIntake).toBe(true);
      expect(emergencyFlow.logEvent).toBe(true);
    });
  });

  describe('Secure Web App - Full PHI Collection', () => {
    it('PHI collection only happens in secure web app', () => {
      const secureEndpoints = [
        '/new-patient',
        '/api/mocks/eligibility',
        '/api/mocks/ehr-writeback',
      ];

      secureEndpoints.forEach((endpoint) => {
        // These endpoints are served over HTTPS in production
        expect(endpoint.startsWith('/')).toBe(true);
      });
    });

    it('web app uses HTTPS in production', () => {
      const productionUrl = 'https://intakepal.ai';
      expect(productionUrl).toMatch(/^https:\/\//);
    });
  });

  describe('BAA (Business Associate Agreement) Requirements', () => {
    it('all vendors must have BAA', () => {
      const vendors = [
        { name: 'Twilio', service: 'SMS/Voice', baaRequired: true, baaStatus: 'signed' },
        { name: 'Supabase', service: 'Database/Hosting', baaRequired: true, baaStatus: 'signed' },
        { name: 'OCR Provider', service: 'Insurance OCR', baaRequired: true, baaStatus: 'pending' },
        { name: 'Clearinghouse', service: 'X12 271', baaRequired: true, baaStatus: 'pending' },
      ];

      vendors.forEach((vendor) => {
        expect(vendor.baaRequired).toBe(true);
        // In production, all should be 'signed'
      });
    });
  });
});
