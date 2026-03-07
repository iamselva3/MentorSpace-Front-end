import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, nameKey, valueKey, height = 300 }) => {

  const colors = [
    'rgba(79, 70, 229, 0.8)',   // indigo
    'rgba(16, 185, 129, 0.8)',  // green
    'rgba(245, 158, 11, 0.8)',  // amber
    'rgba(239, 68, 68, 0.8)',   // red
    'rgba(139, 92, 246, 0.8)',  // purple
    'rgba(236, 72, 153, 0.8)',  // pink
    'rgba(6, 182, 212, 0.8)',   // cyan
  ];

  const chartData = {
    labels: data.map(item => item[nameKey]),
    datasets: [
      {
        data: data.map(item => item[valueKey]),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;