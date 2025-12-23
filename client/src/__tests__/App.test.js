import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock Firebase auth
const mockOnAuthStateChanged = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: mockOnAuthStateChanged,
    signOut: mockSignOut,
  },
  provider: {},
}));

// Mock all child components
jest.mock('../login', () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component</div>;
  };
});

jest.mock('../Dashboard', () => {
  return function MockDashboard({ profileData }) {
    return (
      <div data-testid="dashboard-component">
        Dashboard for {profileData?.firstName || 'Unknown'}
      </div>
    );
  };
});

jest.mock('../PlatformForm', () => {
  return function MockPlatformForm() {
    return <div data-testid="platform-form">Platform Form</div>;
  };
});

describe('App Component', () => {
  beforeEach(() => {
    mockOnAuthStateChanged.mockClear();
    mockSignOut.mockClear();
  });

  test('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  test('shows login when user is not authenticated', async () => {
    // Simulate no user
    mockOnAuthStateChanged.mockImplementation((callback) => {
      callback(null);
      return jest.fn(); // unsubscribe function
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
  });

  test('shows platform form when user is authenticated but no profile', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    
    mockOnAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Mock fetch to return 404 (no profile)
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('platform-form')).toBeInTheDocument();
    });
  });

  test('shows dashboard when user has profile', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockProfile = { firstName: 'John', lastName: 'Doe' };
    
    mockOnAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Mock fetch to return profile data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProfile })
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();
      expect(screen.getByText('Dashboard for John')).toBeInTheDocument();
    });
  });
});
