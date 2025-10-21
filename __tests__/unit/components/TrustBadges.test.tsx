import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustBadges } from '@/components/TrustBadges';

describe('TrustBadges Component', () => {
  describe('Rendering', () => {
    it('renders section heading', () => {
      render(<TrustBadges />);
      expect(screen.getByText('Trusted by healthcare providers')).toBeInTheDocument();
    });

    it('renders all 4 trust badges', () => {
      render(<TrustBadges />);
      expect(screen.getByText('HIPAA Compliant')).toBeInTheDocument();
      expect(screen.getByText('End-to-End Encryption')).toBeInTheDocument();
      expect(screen.getByText('WCAG 2.2 AA')).toBeInTheDocument();
      expect(screen.getByText('Audit Trail')).toBeInTheDocument();
    });

    it('renders badge descriptions', () => {
      render(<TrustBadges />);
      expect(screen.getByText('BAA-backed security')).toBeInTheDocument();
      expect(screen.getByText('PHI stays protected')).toBeInTheDocument();
      expect(screen.getByText('Fully accessible')).toBeInTheDocument();
      expect(screen.getByText('Complete transparency')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders badge icons', () => {
      const { container } = render(<TrustBadges />);
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const { container } = render(<TrustBadges />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('badge titles use heading markup', () => {
      render(<TrustBadges />);
      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s.length).toBe(4);
    });

    it('provides meaningful heading text for screen readers', () => {
      render(<TrustBadges />);
      const headings = screen.getAllByRole('heading', { level: 4 });
      headings.forEach((heading) => {
        expect(heading.textContent).toBeTruthy();
        expect(heading.textContent?.length).toBeGreaterThan(3);
      });
    });
  });

  describe('HIPAA Compliance Messaging', () => {
    it('clearly states HIPAA compliance', () => {
      render(<TrustBadges />);
      expect(screen.getByText('HIPAA Compliant')).toBeInTheDocument();
    });

    it('mentions BAA (Business Associate Agreement)', () => {
      render(<TrustBadges />);
      expect(screen.getByText(/BAA/)).toBeInTheDocument();
    });

    it('highlights PHI protection', () => {
      render(<TrustBadges />);
      expect(screen.getByText(/PHI/)).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance Messaging', () => {
    it('states WCAG 2.2 AA compliance', () => {
      render(<TrustBadges />);
      expect(screen.getByText('WCAG 2.2 AA')).toBeInTheDocument();
    });

    it('describes accessibility benefit', () => {
      render(<TrustBadges />);
      expect(screen.getByText('Fully accessible')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders a grid layout', () => {
      const { container } = render(<TrustBadges />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('centers content', () => {
      const { container } = render(<TrustBadges />);
      const sections = container.querySelectorAll('[class*="center"]');
      expect(sections.length).toBeGreaterThan(0);
    });
  });
});
