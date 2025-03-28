import React, { memo } from 'react';
import { Service } from '../types/Service';

interface UptimeChartProps {
  service: Service;
}

const UptimeChart: React.FC<UptimeChartProps> = memo(({ service }) => {
  const history = service.history || [];
  const values = history.map(record => record.status === 'UP' ? 1 : 0);
  const color = service.status === 'UP' ? '#4CAF50' : '#f44336';
  const MAX_POINTS = 30; // Match backend's MAX_HISTORY_LENGTH

  // If no history, show current status as a short line in the middle
  if (values.length === 0) {
    const currentValue = service.status === 'UP' ? 1 : 0;
    // Create points at 40% and 60% of the width for a short line in the middle
    return (
      <div className="uptime-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="chart-svg"
        >
          <polyline
            points={`40,${(1 - currentValue) * 100} 60,${(1 - currentValue) * 100}`}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Calculate the width based on number of points (right to left)
  const width = (values.length / MAX_POINTS) * 100;
  const startX = 100 - width; // Start from the right
  const points = values.map((value, index) => {
    const x = startX + ((width * index) / (values.length - 1));
    return `${x},${(1 - value) * 100}`;
  }).join(' ');

  return (
    <div className="uptime-chart">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="chart-svg"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

UptimeChart.displayName = 'UptimeChart';

export default UptimeChart; 