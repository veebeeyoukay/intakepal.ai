import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';
import { COPY } from '@/lib/constants';

describe('Hero Component', () => {
  describe('Rendering', () => {
    it('renders the hero title correctly', () => {
      render(<Hero />);
      expect(screen.getByText(COPY.hero.title)).toBeInTheDocument();
    });

    it('renders the hero subtitle', () => {
      render(<Hero />);
      expect(screen.getByText(COPY.hero.subtitle)).toBeInTheDocument();
    });

    it('renders all feature bullet points', () => {
      render(<Hero />);
      COPY.hero.features.forEach((feature) => {
        // Remove HTML tags for text matching
        const textContent = feature.replace(/<[^>]*>/g, '');
        expect(screen.getByText(textContent, { exact: false })).toBeInTheDocument();
      });
    });

    it('displays "IntakePal" brand text', () => {
      render(<Hero />);
      expect(screen.getByText('IntakePal')).toBeInTheDocument();
    });
  });

  describe('CTAs', () => {
    it('renders primary CTA button with correct text', () => {
      render(<Hero />);
      const primaryCTA = screen.getByText(COPY.hero.ctaPrimary);
      expect(primaryCTA).toBeInTheDocument();
    });

    it('renders secondary CTA button with correct text', () => {
      render(<Hero />);
      const secondaryCTA = screen.getByText(COPY.hero.ctaSecondary);
      expect(secondaryCTA).toBeInTheDocument();
    });

    it('primary CTA links to /new-patient', () => {
      render(<Hero />);
      const primaryCTA = screen.getByText(COPY.hero.ctaPrimary).closest('a');
      expect(primaryCTA).toHaveAttribute('href', '/new-patient');
    });

    it('secondary CTA links to #features', () => {
      render(<Hero />);
      const secondaryCTA = screen.getByText(COPY.hero.ctaSecondary).closest('a');
      expect(secondaryCTA).toHaveAttribute('href', '#features');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML (section element)', () => {
      const { container } = render(<Hero />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('has heading hierarchy (h1 for main title)', () => {
      render(<Hero />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(COPY.hero.title);
    });

    it('buttons are accessible', () => {
      render(<Hero />);
      const buttons = screen.getAllByRole('link');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('feature list uses unordered list markup', () => {
      const { container } = render(<Hero />);
      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(COPY.hero.features.length);
    });
  });

  describe('Styling', () => {
    it('applies brand primary color class', () => {
      const { container } = render(<Hero />);
      const brandText = screen.getByText('IntakePal');
      expect(brandText).toHaveClass('text-[--brand-primary]');
    });

    it('applies responsive text sizing', () => {
      render(<Hero />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.className).toMatch(/text-4xl|text-5xl/);
    });
  });

  describe('Content Sanitization (XSS Prevention)', () => {
    it('uses dangerouslySetInnerHTML safely with known content', () => {
      const { container } = render(<Hero />);
      // Verify no script tags were injected
      expect(container.querySelector('script')).toBeNull();
    });
  });
});
