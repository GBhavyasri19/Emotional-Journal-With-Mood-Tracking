import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { Mood } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface MoodChartProps {
  moods: Mood[];
  days?: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({ moods, days = 7 }) => {
  const chartData = useMemo(() => {
    // Generate date labels for the last X days
    const dateLabels = Array.from({ length: days }, (_, i) => {
      return format(subDays(new Date(), days - 1 - i), 'MMM d');
    });

    // Group moods by date
    const moodsByDate = moods.reduce((acc, mood) => {
      const date = format(new Date(mood.timestamp), 'MMM d');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(mood);
      return acc;
    }, {} as Record<string, Mood[]>);

    // Calculate average mood value for each day
    const moodValues = dateLabels.map(date => {
      const dayMoods = moodsByDate[date] || [];
      if (dayMoods.length === 0) return null;
      
      const sum = dayMoods.reduce((total, mood) => total + mood.value, 0);
      return sum / dayMoods.length;
    });

    // Get mood colors for the chart
    const moodColors = dateLabels.map(date => {
      const dayMoods = moodsByDate[date] || [];
      if (dayMoods.length === 0) return 'rgba(200, 200, 200, 0.5)';
      
      // Use the color of the most recent mood for that day
      const latestMood = dayMoods.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      return latestMood.color;
    });

    return {
      labels: dateLabels,
      datasets: [
        {
          label: 'Mood Intensity',
          data: moodValues,
          borderColor: 'rgba(147, 51, 234, 0.8)',
          backgroundColor: 'rgba(147, 51, 234, 0.2)',
          pointBackgroundColor: moodColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          tension: 0.4,
          spanGaps: true,
        },
      ],
    };
  }, [moods, days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 2,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            let label = context.dataset.label || '';
            
            if (label) {
              label += ': ';
            }
            
            if (value !== null) {
              if (value <= 2) return label + 'Very Low';
              if (value <= 4) return label + 'Low';
              if (value <= 6) return label + 'Moderate';
              if (value <= 8) return label + 'High';
              return label + 'Very High';
            }
            return label + 'No data';
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};