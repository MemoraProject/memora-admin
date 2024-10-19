'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubscriptionChart: React.FC = () => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'SUBSCRIPTION BY TYPE',
      },
      legend: {
        position: 'bottom' as const,
      },
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 50,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  const labels = ['Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: '1 Month',
        data: [30, 37, 39, 43, 44, 45],
        backgroundColor: 'rgb(173, 216, 230)',
      },
      {
        label: '3 Months',
        data: [15, 17, 18, 19, 19, 20],
        backgroundColor: 'rgb(255, 206, 86)',
      },
      {
        label: '12 Months',
        data: [12, 12, 13, 13, 13, 13],
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default SubscriptionChart;