import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/mocks/eligibility/route';
import { NextRequest } from 'next/server';

describe('Eligibility API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful Requests', () => {
    it('returns 200 for valid request', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('returns correct response structure', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('ok');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('copay');
      expect(data).toHaveProperty('deductible');
      expect(data).toHaveProperty('notes');
      expect(data).toHaveProperty('raw271');
    });

    it('returns active status for valid member', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.ok).toBe(true);
      expect(data.status).toBe('active');
    });

    it('includes simulated 271 response data', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.raw271).toBeDefined();
      expect(data.raw271).toHaveProperty('tradingPartnerServiceId');
      expect(data.raw271).toHaveProperty('subscriberId');
      expect(data.raw271.subscriberId).toBe('ABC123456789');
    });

    it('includes coverage details', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.copay).toBeDefined();
      expect(data.deductible).toBeDefined();
      expect(data.planType).toBeDefined();
    });

    it('accepts optional serviceType parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
          serviceType: 'specialist',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Validation Errors', () => {
    it('returns 400 for missing sessionId', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.ok).toBe(false);
      expect(data.error).toContain('Missing required fields');
    });

    it('returns 400 for missing payerId', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 for missing memberId', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          dob: '1985-06-15',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns 400 for missing dob', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('returns error message in response body', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          payerId: 'BCBS-FL',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('error');
      expect(typeof data.error).toBe('string');
    });
  });

  describe('HIPAA Compliance', () => {
    it('logs contain DEMO marker', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEMO]'),
        expect.anything()
      );
    });

    it('does not expose full PHI in logs', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      await POST(request);

      // Verify DOB is not logged directly
      const calls = consoleSpy.mock.calls;
      const loggedData = JSON.stringify(calls);
      expect(loggedData).not.toContain('1985-06-15');
    });
  });

  describe('Performance', () => {
    it('includes simulated processing delay', async () => {
      const start = Date.now();

      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'test-session-123',
          payerId: 'BCBS-FL',
          memberId: 'ABC123456789',
          dob: '1985-06-15',
        }),
      });

      await POST(request);
      const duration = Date.now() - start;

      // Mock has 500ms delay
      expect(duration).toBeGreaterThanOrEqual(450);
    });
  });

  describe('Error Handling', () => {
    it('returns 500 for invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });

    it('logs errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error');

      const request = new NextRequest('http://localhost:3000/api/mocks/eligibility', {
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
