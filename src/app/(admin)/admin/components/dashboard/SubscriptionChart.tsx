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

interface SubscriptionData {
  date: string;
  oneMonthUsers: number;
  threeMonthsUsers: number;
  twelveMonthsUsers: number;
}

interface SubscriptionChartProps {
  data: SubscriptionData[];
}
const SubscriptionChart: React.FC<SubscriptionChartProps> = ({ data }) => {
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

  const labels = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleString("default", { month: "short" });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: '1 Month',
        data: data.map(item => item.oneMonthUsers),
        backgroundColor: 'rgb(173, 216, 230)',
      },
      {
        label: '3 Months',
        data: data.map(item => item.threeMonthsUsers),
        backgroundColor: 'rgb(255, 206, 86)',
      },
      {
        label: '12 Months',
        data: data.map(item => item.twelveMonthsUsers),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default SubscriptionChart;