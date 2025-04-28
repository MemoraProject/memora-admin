"use client";
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface SubscriptionMetric {
  metricName: string;
  value: number;
  timestamp: string;
}

interface RevenueCatOverviewMetric {
  id: string;
  object: string;
  name: string;
  description: string;
  unit: string;
  period: string;
  value: number;
  last_updated_at: number;
}

interface RevenueCatOverviewMetrics {
  object: string;
  metrics: RevenueCatOverviewMetric[];
}

interface SubscriptionChartProps {
  data?: never[];
  revenueCatData?: SubscriptionMetric[];
  directRevenueCatData?: RevenueCatOverviewMetrics;
  totalUsers?: number;
}

const SubscriptionChart: React.FC<SubscriptionChartProps> = ({
  revenueCatData,
  directRevenueCatData,
  totalUsers = 0,
}) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "SUBSCRIPTION BY TYPE",
      },
      legend: {
        position: "bottom" as const,
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
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  // Use RevenueCat data from backend
  if (revenueCatData && revenueCatData.length > 0) {
    const getMetricValue = (name: string): number => {
      const metric = revenueCatData.find((m) => m.metricName === name);
      return metric ? metric.value : 0;
    };

    const totalSubscriptions = getMetricValue("total_active_subscriptions");
    const totalRevenue = getMetricValue("total_revenue");

    // Calculate conversion rate using the total users from backend
    const effectiveTotalUsers = totalUsers > 0 ? totalUsers : 10000; // Fallback
    const conversionRate = (
      (totalSubscriptions / effectiveTotalUsers) *
      100
    ).toFixed(2);

    const chartData = {
      labels: ["Current Subscriptions"],
      datasets: [
        {
          label: "1 Month",
          data: [getMetricValue("active_1_month_subscriptions")],
          backgroundColor: "rgb(173, 216, 230)",
        },
        {
          label: "3 Months",
          data: [getMetricValue("active_3_month_subscriptions")],
          backgroundColor: "rgb(255, 206, 86)",
        },
        {
          label: "12 Months",
          data: [getMetricValue("active_12_month_subscriptions")],
          backgroundColor: "rgb(75, 192, 192)",
        },
      ],
    };

    return (
      <div>
        {/* Key Metrics Summary */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-blue-700">
              Total Revenue
            </div>
            <div className="text-3xl font-bold text-blue-900">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-green-700">
              Active Subscriptions
            </div>
            <div className="text-3xl font-bold text-green-900">
              {totalSubscriptions}
            </div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-purple-700">
              Conversion Rate
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {conversionRate}%
            </div>
            <div className="mt-1 text-xs text-purple-600">
              Based on {effectiveTotalUsers} total users
            </div>
          </div>
        </div>

        {/* <div style={{ height: "350px", width: "100%" }}>
          <Bar options={options} data={chartData} />
        </div> */}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Subscription Breakdown</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span>1 Month Plan:</span>
                <span className="font-medium">
                  {getMetricValue("active_1_month_subscriptions")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>3 Month Plan:</span>
                <span className="font-medium">
                  {getMetricValue("active_3_month_subscriptions")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>12 Month Plan:</span>
                <span className="font-medium">
                  {getMetricValue("active_12_month_subscriptions")}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Revenue Details</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Avg. Revenue per User:</span>
                <span className="font-medium">
                  $
                  {totalSubscriptions > 0
                    ? (totalRevenue / totalSubscriptions).toFixed(2)
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Recurring Revenue:</span>
                <span className="font-medium">
                  $
                  {getMetricValue("mrr")
                    ? getMetricValue("mrr").toFixed(2)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use direct RevenueCat metrics
  if (directRevenueCatData && directRevenueCatData.metrics) {
    const getMetricValue = (id: string): number => {
      const metric = directRevenueCatData.metrics.find((m) => m.id === id);
      return metric ? metric.value : 0;
    };

    // Extract relevant metrics
    const activeSubscriptions = getMetricValue("active_subscriptions");
    const mrr = getMetricValue("mrr");
    const revenue = getMetricValue("revenue");
    const installations = getMetricValue("installations");

    // Calculate conversion rate using either installations from RevenueCat or totalUsers from backend
    // Use whichever is available and larger for more accurate representation
    const effectiveTotalUsers = Math.max(totalUsers, installations);
    const conversionRate =
      effectiveTotalUsers > 0
        ? ((activeSubscriptions / effectiveTotalUsers) * 100).toFixed(2)
        : "N/A";

    const chartData = {
      labels: ["Active Subscriptions"],
      datasets: [
        {
          label: "Subscriptions",
          data: [activeSubscriptions],
          backgroundColor: "rgb(75, 192, 192)",
        },
      ],
    };

    return (
      <div>
        {/* Key Metrics Summary */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-blue-700">
              Total Revenue
            </div>
            <div className="text-3xl font-bold text-blue-900">
              ${revenue.toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-green-700">
              Active Subscriptions
            </div>
            <div className="text-3xl font-bold text-green-900">
              {activeSubscriptions}
            </div>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-purple-700">
              Conversion Rate
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {conversionRate}%
            </div>
            <div className="mt-1 text-xs text-purple-600">
              Based on {effectiveTotalUsers} total users
            </div>
          </div>
        </div>

        {/* <div style={{ height: "250px", width: "100%" }}>
          <Bar options={options} data={chartData} />
        </div> */}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">
              Monthly Recurring Revenue
            </div>
            <div className="text-2xl font-bold">${mrr.toFixed(2)}</div>
            <div className="mt-2 text-xs text-gray-500">
              {activeSubscriptions > 0
                ? `$${(mrr / activeSubscriptions).toFixed(2)} per user`
                : ""}
            </div>
          </div>
          {/* <div className="rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Installations</div>
            <div className="text-2xl font-bold">{installations}</div>
            <div className="text-xs text-gray-500">
              {conversionRate}% conversion to paid
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  // No data available
  return (
    <div className="flex h-80 items-center justify-center">
      <p>No subscription data available</p>
    </div>
  );
};

export default SubscriptionChart;
