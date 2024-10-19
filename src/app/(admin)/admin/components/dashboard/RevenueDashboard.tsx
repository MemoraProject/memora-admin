'use client';
import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import styles from './RevenueDashboard.module.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueDashboard: React.FC = () => {
    const gaugeChartData = {
        datasets: [{
            data: [300, 380, 200, 120], // Adjust these values as needed
            backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444', '#e5e7eb'],
            borderWidth: 0,
            circumference: 270, // Extend beyond 180 degrees
            rotation: 225, // Start from 7:30 position
        }]
    };

    const gaugeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        }
    };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Premium 1 month',
        data: [300, 400, 500, 600, 500, 700, 600, 800, 900, 1000, 800, 900],
        backgroundColor: '#fbbf24',
      },
      {
        label: 'Premium 3 months',
        data: [500, 600, 700, 800, 900, 1000, 900, 1100, 1200, 1300, 1100, 1200],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Premium 12 months',
        data: [200, 300, 400, 300, 200, 400, 300, 500, 600, 700, 600, 700],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Revenue by customer type',
      },
    },
  };

  return (
    <div className={styles.revenueDashboard}>
      <div className={styles.gaugeChart}>
        <h2>Today's Revenue</h2>
        <div style={{ position: 'relative', height: '200px', width: '100%' }}>
          <Doughnut data={gaugeChartData} options={gaugeChartOptions} />
          <div className={styles.gaugeValue}>880k</div>
        </div>
        <div className={styles.legend}>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#fbbf24'}}></span>
                <span className={styles.legendLabel}>Premium 1 month</span>
            </div>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#3b82f6'}}></span>
                <span className={styles.legendLabel}>Premium 3 months</span>
            </div>
            <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{backgroundColor: '#ef4444'}}></span>
                <span className={styles.legendLabel}>Premium 12 months</span>
            </div>
        </div>
      </div>
      <div className={styles.barChart}>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
      <div className={styles.controls}>
        {/* <button className={styles.exportBtn}>Export ↓</button> */}
        <select className={styles.dateRange}>
          <option>Jan 2024 - Dec 2024</option>
        </select>
      </div>
    </div>
  );
};

export default RevenueDashboard;