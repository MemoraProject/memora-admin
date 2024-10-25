"use client";
import React, { useState } from "react";
import UserChart from "./UserChart";
import styles from "./UserChartContainer.module.css";

const UserChartContainer: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(10);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(Number(e.target.value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="text-xl font-semibold text-gray-800">
          NEW AND EXISTING USERS
        </h2>
        <select
          value={timeRange}
          onChange={handleTimeRangeChange}
          className={styles.select}
        >
          <option value={6}>Last 6 months</option>
          <option value={9}>Last 9 months</option>
          <option value={12}>Last 12 months</option>
        </select>
      </div>
      <UserChart months={timeRange} />
    </div>
  );
};

export default UserChartContainer;
