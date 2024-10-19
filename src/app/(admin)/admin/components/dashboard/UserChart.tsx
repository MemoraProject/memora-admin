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

const UserChart: React.FC = () => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'NEW AND EXISTING USERS',
      },
      legend: {
        position: 'bottom' as const,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const labels = ['Jun', 'Jul', 'Aug', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Users',
        data: [700, 850, 1050, 1350, 1500, 1750],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'New Users',
        data: [150, 200, 300, 250, 300, 250],
        backgroundColor: 'rgb(173, 216, 230)',
      },
    ],
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default UserChart;