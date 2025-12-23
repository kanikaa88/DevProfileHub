import React, { memo, useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const HeatmapComponent = memo(function HeatmapComponent({ type, data, username, totalContributions, totalSubmissions }) {
  if (type === 'github') {
    if (!username) return null;
    
    // Convert GitHub contribution data to heatmap format with memoization
    const heatmapData = useMemo(() => {
      if (!data) return [];
      return Object.entries(data).map(([date, count]) => ({
        date: date,
        count: count
      }));
    }, [data]);
    
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">GitHub Activity</h3>
          {totalContributions > 0 && (
            <span className="text-sm text-gray-600">
              {totalContributions} contributions this year
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <CalendarHeatmap
            startDate={new Date(new Date().getFullYear(), 0, 1)}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              if (value.count === 0) return 'color-empty';
              if (value.count <= 2) return 'color-scale-1';
              if (value.count <= 4) return 'color-scale-2';
              if (value.count <= 6) return 'color-scale-3';
              return 'color-scale-4';
            }}
            tooltipDataAttrs={(value) => ({
              'data-tip': value ? `${value.count} contributions on ${value.date}` : 'No contributions'
            })}
            showWeekdayLabels={false}
            horizontal={true}
            showMonthLabels={true}
            onClick={(value) => {
              if (value) {
                console.log(`Clicked on ${value.date} with ${value.count} contributions`);
              }
            }}
          />
        </div>
        <style>{`
          .color-empty { fill: #ebedf0; }
          .color-scale-1 { fill: #c6e48b; }
          .color-scale-2 { fill: #7bc96f; }
          .color-scale-3 { fill: #239a3b; }
          .color-scale-4 { fill: #196127; }
          
          /* Make heatmap smaller and more compact */
          .react-calendar-heatmap {
            font-size: 10px;
          }
          
          .react-calendar-heatmap .react-calendar-heatmap-month-label {
            font-size: 10px;
          }
          
          .react-calendar-heatmap .react-calendar-heatmap-weekday-label {
            font-size: 9px;
          }
          
          .react-calendar-heatmap rect {
            width: 8px;
            height: 8px;
            rx: 1;
            ry: 1;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'leetcode') {
    if (!data || Object.keys(data).length === 0) return null;

    // Convert LeetCode submission data to heatmap format with memoization
    const heatmapData = useMemo(() => {
      if (!data) return [];
      return Object.entries(data).map(([timestamp, count]) => ({
        date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
        count: count
      }));
    }, [data]);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">LeetCode Activity</h3>
          {totalSubmissions > 0 && (
            <span className="text-sm text-gray-600">
              {totalSubmissions} submissions this year
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <CalendarHeatmap
            startDate={new Date(new Date().getFullYear(), 0, 1)}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              if (value.count === 0) return 'color-empty';
              if (value.count <= 2) return 'color-scale-1';
              if (value.count <= 4) return 'color-scale-2';
              if (value.count <= 6) return 'color-scale-3';
              return 'color-scale-4';
            }}
            tooltipDataAttrs={(value) => ({
              'data-tip': value ? `${value.count} submissions on ${value.date}` : 'No submissions'
            })}
            showWeekdayLabels={false}
            horizontal={true}
            showMonthLabels={true}
            onClick={(value) => {
              if (value) {
                console.log(`Clicked on ${value.date} with ${value.count} submissions`);
              }
            }}
          />
        </div>
        <style>{`
          .color-empty { fill: #ebedf0; }
          .color-scale-1 { fill: #c6e48b; }
          .color-scale-2 { fill: #7bc96f; }
          .color-scale-3 { fill: #239a3b; }
          .color-scale-4 { fill: #196127; }
          
          /* Make heatmap smaller and more compact */
          .react-calendar-heatmap {
            font-size: 10px;
          }
          
          .react-calendar-heatmap .react-calendar-heatmap-month-label {
            font-size: 10px;
          }
          
          .react-calendar-heatmap .react-calendar-heatmap-weekday-label {
            font-size: 9px;
          }
          
          .react-calendar-heatmap rect {
            width: 8px;
            height: 8px;
            rx: 1;
            ry: 1;
          }
        `}</style>
      </div>
    );
  }

  return null;
});

export default HeatmapComponent;
