"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getUserActivityMetrics,
  getRevenueCatOverviewMetrics,
} from "@/api/dashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface UserActivityData {
  [key: string]: number;
}

interface UserChartProps {
  months: number;
}

const UserChart: React.FC<UserChartProps> = ({ months }) => {
  const [activityData, setActivityData] = useState<UserActivityData | null>(
    null,
  );
  const [revenueCatMetrics, setRevenueCatMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<
    "revenuecat" | "revenuecat-direct"
  >("revenuecat-direct");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (dataSource === "revenuecat") {
          // RevenueCat data through backend
          const response = await getUserActivityMetrics();
          setActivityData(response);
          setRevenueCatMetrics(null);
        } else {
          // Direct RevenueCat API call
          const response = await getRevenueCatOverviewMetrics();
          setRevenueCatMetrics(response);
          setActivityData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Trying alternative data source...");

        // Fallback logic
        if (dataSource === "revenuecat-direct") {
          setDataSource("revenuecat");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [months, dataSource]);

  const toggleDataSource = () => {
    setDataSource((prev) =>
      prev === "revenuecat" ? "revenuecat-direct" : "revenuecat",
    );
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  let chartData;

  if (dataSource === "revenuecat" && activityData) {
    chartData = {
      labels: Object.keys(activityData).map((key) => {
        switch (key) {
          case "active_today":
            return "Active Today";
          case "active_last_week":
            return "Active Last Week";
          case "active_last_month":
            return "Active Last Month";
          case "inactive":
            return "Inactive";
          default:
            return key;
        }
      }),
      datasets: [
        {
          label: "User Activity",
          data: Object.values(activityData),
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  } else if (dataSource === "revenuecat-direct" && revenueCatMetrics) {
    // Extract and transform data from direct RevenueCat metrics
    const metrics = revenueCatMetrics.metrics || [];

    // Find active trials or other relevant metrics
    const activeTrials = metrics.find((m: any) => m.id === "active_trials") || {
      value: 0,
    };
    const activeSubscriptions = metrics.find(
      (m: any) => m.id === "active_subscriptions",
    ) || { value: 0 };
    const installsToday = metrics.find(
      (m: any) => m.id === "installs_today",
    ) || { value: 0 };
    const installsMonth = metrics.find(
      (m: any) => m.id === "installs_month",
    ) || { value: 0 };

    chartData = {
      labels: [
        "Active Trials",
        "Active Subscriptions",
        "Installs Today",
        "Installs This Month",
      ],
      datasets: [
        {
          label: "User Metrics",
          data: [
            activeTrials.value,
            activeSubscriptions.value,
            installsToday.value,
            installsMonth.value,
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  }

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{error && <p className="text-sm text-red-500">{error}</p>}</div>
        <button
          onClick={toggleDataSource}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          {dataSource === "revenuecat"
            ? "Switch to RevenueCat Direct API"
            : "Switch to Backend API"}
        </button>
      </div>
      <div style={{ height: "350px", width: "100%" }}>
        {chartData ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p>No data available to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserChart;
