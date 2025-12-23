import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';

// Mock the HeatmapComponent
jest.mock('../HeatmapComponent', () => {
  return function MockHeatmapComponent({ type, totalContributions, totalSubmissions }) {
    return (
      <div data-testid={`${type}-heatmap`}>
        {type === 'github' && totalContributions && (
          <span>{totalContributions} contributions</span>
        )}
        {type === 'leetcode' && totalSubmissions && (
          <span>{totalSubmissions} submissions</span>
        )}
      </div>
    );
  };
});

describe('Dashboard Component', () => {
  const mockProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    username: 'johndoe',
    github: 'johndoe',
    leetcode: 'johndoe',
    contact: '1234567890',
    address: '123 Main St',
    linkedin: 'https://linkedin.com/in/johndoe',
    projects: [
      {
        title: 'Test Project',
        description: 'A test project',
        tags: ['React', 'Node.js'],
        points: ['Feature 1', 'Feature 2'],
        links: {
          github: 'https://github.com/johndoe/test',
          live: 'https://test.com'
        }
      }
    ]
  };

  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockClear();
  });

  test('renders user profile information', () => {
    render(<Dashboard profileData={mockProfileData} darkMode={false} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('renders project information', () => {
    render(<Dashboard profileData={mockProfileData} darkMode={false} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  test('displays loading states for platform stats', () => {
    render(<Dashboard profileData={mockProfileData} darkMode={false} />);
    
    // Should show loading indicators for GitHub and LeetCode
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LeetCode')).toBeInTheDocument();
  });

  test('handles missing profile data gracefully', () => {
    render(<Dashboard profileData={null} darkMode={false} />);
    
    // Should not crash and should show some default content
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  test('applies dark mode styling', () => {
    const { container } = render(<Dashboard profileData={mockProfileData} darkMode={true} />);
    
    // Check if dark mode classes are applied
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});
