/**
 * Login Component Test Cases
 * Tests for authentication functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';

// Mock fetch
global.fetch = jest.fn();

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays demo credentials', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/demo@ebook.com/i)).toBeInTheDocument();
  });

  test('switches to register form', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const switchButton = screen.getByText(/don't have an account/i);
    fireEvent.click(switchButton);
    
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        email: 'demo@ebook.com',
        name: 'Demo User',
        giftPoints: 500
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'demo@ebook.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'demo123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockResponse.user, mockResponse.token);
    });
  });

  test('displays error on failed login', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    });

    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@email.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('validates required fields', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  test('handles registration', async () => {
    const mockResponse = {
      token: 'mock-token',
      user: {
        id: '2',
        email: 'new@ebook.com',
        name: 'New User',
        giftPoints: 100
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<Login onLogin={mockOnLogin} />);
    
    // Switch to register
    fireEvent.click(screen.getByText(/don't have an account/i));
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@ebook.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'newpass123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(mockResponse.user, mockResponse.token);
    });
  });

  test('shows loading state during submission', async () => {
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ token: 'token', user: {} })
      }), 100))
    );

    render(<Login onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'demo@ebook.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'demo123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/please wait/i)).toBeInTheDocument();
  });
});

// Made with Bob
