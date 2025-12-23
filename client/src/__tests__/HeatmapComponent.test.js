import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeatmapComponent from '../HeatmapComponent';

// Mock react-calendar-heatmap
jest.mock('react-calendar-heatmap', () => {
  return function MockCalendarHeatmap({ values, type }) {
    return (
      <div data-testid="calendar-heatmap">
        {values.map((value, index) => (
          <div key={index} data-testid={`heatmap-day-${value.date}`}>
            {value.count} contributions on {value.date}
          </div>
        ))}
      </div>
    );
  };
});

describe('HeatmapComponent', () => {
  const mockGitHubData = {
    '2024-01-01': 5,
    '2024-01-02': 3,
    '2024-01-03': 0,
    '2024-01-04': 8
  };

  const mockLeetCodeData = {
    '1640995200': 2, // 2022-01-01
    '1641081600': 1, // 2022-01-02
    '1641168000': 0, // 2022-01-03
    '1641254400': 3  // 2022-01-04
  };

  test('renders GitHub heatmap with correct data', () => {
    render(
      <HeatmapComponent
        type="github"
        data={mockGitHubData}
        username="testuser"
        totalContributions={16}
      />
    );

    expect(screen.getByText('GitHub Activity')).toBeInTheDocument();
    expect(screen.getByText('16 contributions this year')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-heatmap')).toBeInTheDocument();
  });

  test('renders LeetCode heatmap with correct data', () => {
    render(
      <HeatmapComponent
        type="leetcode"
        data={mockLeetCodeData}
        username="testuser"
        totalSubmissions={6}
      />
    );

    expect(screen.getByText('LeetCode Activity')).toBeInTheDocument();
    expect(screen.getByText('6 submissions this year')).toBeInTheDocument();
  });

  test('returns null when username is not provided for GitHub', () => {
    const { container } = render(
      <HeatmapComponent
        type="github"
        data={mockGitHubData}
        username={null}
        totalContributions={16}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('returns null when data is empty', () => {
    const { container } = render(
      <HeatmapComponent
        type="leetcode"
        data={{}}
        username="testuser"
        totalSubmissions={0}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('handles missing data gracefully', () => {
    render(
      <HeatmapComponent
        type="github"
        data={null}
        username="testuser"
        totalContributions={0}
      />
    );

    expect(screen.getByText('GitHub Activity')).toBeInTheDocument();
    expect(screen.getByText('0 contributions this year')).toBeInTheDocument();
  });
});
