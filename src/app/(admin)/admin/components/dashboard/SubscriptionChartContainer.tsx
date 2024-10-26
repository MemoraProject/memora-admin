"use client";
import React, { useState, useEffect } from "react";
import SubscriptionChart from "./SubscriptionChart";
import styles from "./SubscriptionChartContainer.module.css";

interface SubscriptionData {
  date: string;
  oneMonthUsers: number;
  threeMonthsUsers: number;
  twelveMonthsUsers: number;
}

const SubscriptionChartContainer: React.FC = () => {
  const [timeRange, setTimeRange] = useState("6");
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.memora.vn/api/Dashboard/subscription-dashboard?months=${timeRange}`,
        );
        const data = await response.json();
        setSubscriptionData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          SUBSCRIPTION BY TYPE
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
          <option value="12">This year</option>
        </select>
      </div>
      <SubscriptionChart data={subscriptionData} />
    </div>
  );
};

export default SubscriptionChartContainer;
