import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/mocks/ehr-writeback/route';
import { NextRequest } from 'next/server';

describe('EHR Write-back API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPatient = {
    firstName: 'Jane',
    lastName: 'Doe (DEMO)',
    dob: '1985-06-15',
    phone: '+1-555-0123',
    email: 'jane.demo@example.com',
  };

  const validCoverage = {
    payerName: 'Blue Cross Blue Shield (DEMO)',
    memberId: 'ABC123456789',
    status: 'active',
  };

  const validConsents = {
    HIPAA_NPP: true,
    CONSENT_TREAT: true,
    FIN_RESP: true,
    TCPA: true,
  };

  const validAnswers = {
    allergies: 'None',
    medications: 'Prenatal vitamin',
    reason: 'Annual checkup',
  };

  describe('Successful Requests', () => {
    it('returns 200 for valid request', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
          coverage: validCoverage,
          consents: validConsents,
          answers: validAnswers,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('returns correct response structure with FHIR resources', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('ok', true);
      expect(data).toHaveProperty('writtenResources');
      expect(data).toHaveProperty('timestamp');
      expect(Array.isArray(data.writtenResources)).toBe(true);
    });

    it('creates Patient FHIR resource', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      const patientResource = data.writtenResources.find(
        (r: any) => r.resourceType === 'Patient'
      );
      expect(patientResource).toBeDefined();
      expect(patientResource.status).toBe('created');
      expect(patientResource.id).toContain('Patient/');
    });

    it('creates Coverage FHIR resource', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      const coverageResource = data.writtenResources.find(
        (r: any) => r.resourceType === 'Coverage'
      );
      expect(coverageResource).toBeDefined();
    });

    it('creates DocumentReference for consents', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      const docRef = data.writtenResources.find(
        (r: any) => r.resourceType === 'DocumentReference'
      );
      expect(docRef).toBeDefined();
      expect(docRef).toHaveProperty('contentUrl');
      expect(docRef.contentUrl).toContain('.pdf');
    });

    it('creates QuestionnaireResponse resource', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      const qResponse = data.writtenResources.find(
        (r: any) => r.resourceType === 'QuestionnaireResponse'
      );
      expect(qResponse).toBeDefined();
    });

    it('includes timestamp in ISO format', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.timestamp).toBeDefined();
      expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
    });

    it('creates all 4 FHIR resources', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
          coverage: validCoverage,
          consents: validConsents,
          answers: validAnswers,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.writtenResources.length).toBe(4);
    });
  });

  describe('Validation Errors', () => {
    it('returns 400 for missing sessionId', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          patient: validPatient,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Missing required fields');
    });

    it('returns 400 for missing patient data', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns error message in response body', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');
    });
  });

  describe('HIPAA Compliance & Audit Logging', () => {
    it('logs EHR write-back event with DEMO marker', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEMO] EHR Write-back:'),
        expect.anything()
      );
    });

    it('logs audit event for write-back', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEMO] Audit Event:'),
        expect.objectContaining({
          action: 'EHR_WRITEBACK',
          actor: 'system',
          entity: 'intake_session',
        })
      );
    });

    it('audit log includes sessionId', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      const auditCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('Audit Event')
      );
      expect(auditCall).toBeDefined();
      expect(auditCall![1]).toHaveProperty('entityId', 'test-session-123');
    });

    it('audit log includes timestamp', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      const auditCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('Audit Event')
      );
      expect(auditCall![1]).toHaveProperty('timestamp');
    });

    it('audit log includes success flag', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      const auditCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('Audit Event')
      );
      expect(auditCall![1]).toHaveProperty('success', true);
    });

    it('logs patient name with DEMO marker', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);

      const writebackCall = consoleSpy.mock.calls.find((call) =>
        call[0].includes('EHR Write-back')
      );
      expect(writebackCall![1].patient).toContain('(DEMO)');
    });
  });

  describe('Performance', () => {
    it('includes simulated processing delay', async () => {
      const start = Date.now();

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          patient: validPatient,
        }),
      });

      await POST(request);
      const duration = Date.now() - start;

      // Mock has 800ms delay
      expect(duration).toBeGreaterThanOrEqual(750);
    });
  });

  describe('Error Handling', () => {
    it('returns 500 for invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('logs errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error');

      const request = new NextRequest('http://localhost:3000/api/mocks/ehr-writeback', {
        method: 'POST',
        body: 'invalid json',
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEMO]'),
        expect.anything()
      );
    });
  });
});
