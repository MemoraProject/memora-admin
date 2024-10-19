'use client'
import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import styles from './DashboardCard.module.css';

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, CategoryScale);

interface DashboardCardProps {
  title: string;
  value: string;
  percentage: number;
  trendData: number[];
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, percentage, trendData }) => {
  const gaugeChartData = {
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: ['#FF69B4', '#E6E6FA'],
      borderWidth: 0,
      cutout: '80%',
    }]
  };

  const gaugeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    }
  };

  const trendChartData = {
    labels: new Array(trendData.length).fill(''),
    datasets: [{
      data: trendData,
      borderColor: '#20B2AA',
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0.4
    }]
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.leftSection}>
        <div className={styles.gaugeChart}>
          <Doughnut data={gaugeChartData} options={gaugeChartOptions} />
          <div className={styles.gaugeValue}>{value}</div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.trendChart}>
          <Line data={trendChartData} options={trendChartOptions} />
        </div>
        <div className={styles.percentage}>{percentage}% ▲</div>
      </div>
    </div>
  );
};

export default DashboardCard;