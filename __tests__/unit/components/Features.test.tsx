import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Features } from '@/components/Features';

describe('Features Component', () => {
  describe('Rendering', () => {
    it('renders the section heading', () => {
      render(<Features />);
      expect(screen.getByText('Everything you need for seamless intake')).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      render(<Features />);
      expect(screen.getByText('Capture once. Pre-fill everywhere.')).toBeInTheDocument();
    });

    it('renders all 4 feature cards', () => {
      render(<Features />);
      expect(screen.getByText('No More Clipboards')).toBeInTheDocument();
      expect(screen.getByText('Real-Time Eligibility')).toBeInTheDocument();
      expect(screen.getByText('EHR Write-Back')).toBeInTheDocument();
      expect(screen.getByText('Spanish + Accessibility')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      render(<Features />);
      expect(
        screen.getByText(/Patients complete intake via voice, text, or web before arrival/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/AI OCR extracts insurance details and verifies coverage/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Demographics, consents, and history flow directly into your EHR/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/WCAG 2.2 AA compliant with full Spanish support/)
      ).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders feature icons', () => {
      const { container } = render(<Features />);
      // Icons are rendered as SVG elements from lucide-react
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const { container } = render(<Features />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'features');
    });

    it('has heading hierarchy', () => {
      render(<Features />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Everything you need for seamless intake');
    });

    it('feature titles use heading markup', () => {
      render(<Features />);
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBe(4);
    });
  });

  describe('Layout', () => {
    it('renders a grid layout for features', () => {
      const { container } = render(<Features />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('each feature is wrapped in a card', () => {
      const { container } = render(<Features />);
      const cards = container.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Brand Compliance', () => {
    it('uses brand colors for icons', () => {
      const { container } = render(<Features />);
      const iconContainers = container.querySelectorAll('[class*="brand-primary"]');
      expect(iconContainers.length).toBeGreaterThanOrEqual(4);
    });
  });
});
