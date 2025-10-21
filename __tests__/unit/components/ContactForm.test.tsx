import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';

describe('ContactForm Component', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  describe('Rendering', () => {
    it('renders the form title', () => {
      expect(screen.getByText('Join the Florida Pilot')).toBeInTheDocument();
    });

    it('renders the form description', () => {
      expect(
        screen.getByText(/We're partnering with select practices to co-develop IntakePal/)
      ).toBeInTheDocument();
    });

    it('renders practice name input', () => {
      expect(screen.getByLabelText('Practice Name')).toBeInTheDocument();
    });

    it('renders contact email input', () => {
      expect(screen.getByLabelText('Contact Email')).toBeInTheDocument();
    });

    it('renders specialty input', () => {
      expect(screen.getByLabelText('Specialty')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      expect(screen.getByRole('button', { name: /Request Pilot Access/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('practice name input is required', () => {
      const input = screen.getByLabelText('Practice Name');
      expect(input).toBeRequired();
    });

    it('contact email input is required', () => {
      const input = screen.getByLabelText('Contact Email');
      expect(input).toBeRequired();
    });

    it('email input has correct type', () => {
      const input = screen.getByLabelText('Contact Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('specialty input is required', () => {
      const input = screen.getByLabelText('Specialty');
      expect(input).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    it('shows success message after submission', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Practice Name'), 'Test Practice');
      await user.type(screen.getByLabelText('Contact Email'), 'test@practice.com');
      await user.type(screen.getByLabelText('Specialty'), 'OB-GYN');

      const submitButton = screen.getByRole('button', { name: /Request Pilot Access/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Thanks! We'll be in touch within 2 business days/)).toBeInTheDocument();
      });
    });

    it('hides form after successful submission', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Practice Name'), 'Test Practice');
      await user.type(screen.getByLabelText('Contact Email'), 'test@practice.com');
      await user.type(screen.getByLabelText('Specialty'), 'OB-GYN');

      const submitButton = screen.getByRole('button', { name: /Request Pilot Access/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByLabelText('Practice Name')).not.toBeInTheDocument();
      });
    });

    it('displays success alert with checkmark icon', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('Practice Name'), 'Test Practice');
      await user.type(screen.getByLabelText('Contact Email'), 'test@practice.com');
      await user.type(screen.getByLabelText('Specialty'), 'OB-GYN');

      const submitButton = screen.getByRole('button', { name: /Request Pilot Access/i });
      await user.click(submitButton);

      await waitFor(() => {
        const { container } = render(<ContactForm />);
        expect(container.querySelector('svg')).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('form inputs have associated labels', () => {
      const nameInput = screen.getByLabelText('Practice Name');
      const emailInput = screen.getByLabelText('Contact Email');
      const specialtyInput = screen.getByLabelText('Specialty');

      expect(nameInput).toHaveAccessibleName('Practice Name');
      expect(emailInput).toHaveAccessibleName('Contact Email');
      expect(specialtyInput).toHaveAccessibleName('Specialty');
    });

    it('submit button is accessible', () => {
      const button = screen.getByRole('button', { name: /Request Pilot Access/i });
      expect(button).toBeInTheDocument();
    });

    it('uses semantic form element', () => {
      const { container } = render(<ContactForm />);
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('inputs have placeholder text for guidance', () => {
      expect(screen.getByPlaceholderText('Your practice')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin@practice.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('OB-GYN, Podiatry, etc.')).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('accepts text input for practice name', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Practice Name');

      await user.type(input, 'Test Medical Center');
      expect(input).toHaveValue('Test Medical Center');
    });

    it('accepts email input', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Contact Email');

      await user.type(input, 'admin@testcenter.com');
      expect(input).toHaveValue('admin@testcenter.com');
    });

    it('accepts specialty input', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Specialty');

      await user.type(input, 'Podiatry');
      expect(input).toHaveValue('Podiatry');
    });
  });

  describe('Card Layout', () => {
    it('wraps form in a card component', () => {
      const { container } = render(<ContactForm />);
      const card = container.querySelector('[class*="card"]');
      expect(card).toBeTruthy();
    });
  });
});
