'use client';
import React, { useState } from 'react';
import UserChart from './UserChart';
import styles from './UserChartContainer.module.css';

const UserChartContainer: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 6 months');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>NEW AND EXISTING USERS</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className={styles.select}
        >
          <option value="Last 6 months">Last 6 months</option>
          <option value="Last 12 months">Last 12 months</option>
          <option value="This year">This year</option>
        </select>
      </div>
      <UserChart />
    </div>
  );
};

export default UserChartContainer;