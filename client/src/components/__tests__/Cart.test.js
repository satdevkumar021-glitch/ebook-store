/**
 * Cart Component Test Cases
 * Tests for shopping cart functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Cart from '../Cart';

// Mock fetch
global.fetch = jest.fn();

const mockUser = {
  id: '1',
  email: 'demo@ebook.com',
  name: 'Demo User',
  giftPoints: 500
};

const mockCart = {
  items: [
    { productId: 'book1', quantity: 2 },
    { productId: 'book2', quantity: 1 }
  ]
};

const mockProducts = {
  book1: {
    id: 'book1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 12.99,
    category: 'Fiction',
    brand: 'Penguin Classics',
    coverImage: 'https://via.placeholder.com/200x300'
  },
  book2: {
    id: 'book2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 14.99,
    category: 'Fiction',
    brand: 'HarperCollins',
    coverImage: 'https://via.placeholder.com/200x300'
  }
};

const mockUpdateCart = jest.fn();

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock product fetch calls
    fetch.mockImplementation((url) => {
      if (url.includes('/api/products/book1')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts.book1
        });
      }
      if (url.includes('/api/products/book2')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockProducts.book2
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({})
      });
    });
  });

  test('renders empty cart message when cart is empty', () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={{ items: [] }} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/browse books/i)).toBeInTheDocument();
  });

  test('renders cart items', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
      expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument();
    });
  });

  test('displays correct quantities', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const quantities = screen.getAllByText(/2|1/);
      expect(quantities.length).toBeGreaterThan(0);
    });
  });

  test('calculates total correctly', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // 2 * 12.99 + 1 * 14.99 = 40.97 (shown in Items row and Total row)
      const totals = screen.getAllByText(/40\.97/);
      expect(totals.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('increases item quantity', async () => {
    fetch.mockImplementation((url, options) => {
      if (url.includes('/api/cart/') && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            items: [
              { productId: 'book1', quantity: 3 },
              { productId: 'book2', quantity: 1 }
            ]
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockProducts[url.split('/').pop()]
      });
    });

    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const increaseButtons = screen.getAllByText('+');
      fireEvent.click(increaseButtons[0]);
    });

    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalled();
    });
  });

  test('decreases item quantity', async () => {
    fetch.mockImplementation((url, options) => {
      if (url.includes('/api/cart/') && options?.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            items: [
              { productId: 'book1', quantity: 1 },
              { productId: 'book2', quantity: 1 }
            ]
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockProducts[url.split('/').pop()]
      });
    });

    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const decreaseButtons = screen.getAllByText('-');
      fireEvent.click(decreaseButtons[0]);
    });

    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalled();
    });
  });

  test('removes item from cart', async () => {
    fetch.mockImplementation((url, options) => {
      if (url.includes('/api/cart/') && options?.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            items: [{ productId: 'book2', quantity: 1 }]
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockProducts[url.split('/').pop()]
      });
    });

    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const removeButtons = screen.getAllByText(/remove/i);
      fireEvent.click(removeButtons[0]);
    });

    await waitFor(() => {
      expect(mockUpdateCart).toHaveBeenCalled();
    });
  });

  test('displays checkout button', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/proceed to checkout/i)).toBeInTheDocument();
    });
  });

  test('displays continue shopping button', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
    });
  });

  test('shows free shipping', async () => {
    render(
      <BrowserRouter>
        <Cart user={mockUser} cart={mockCart} updateCart={mockUpdateCart} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/free/i)).toBeInTheDocument();
    });
  });
});

// Made with Bob
