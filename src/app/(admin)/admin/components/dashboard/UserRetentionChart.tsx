"use client";
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { UserWithActivityStatus } from "@/models/user";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface UserRetentionChartProps {
  userData: UserWithActivityStatus[];
}

const UserRetentionChart: React.FC<UserRetentionChartProps> = ({
  userData,
}) => {
  // Activity status mapping
  const activityStatusMap = {
    green: {
      color: "bg-green-500",
      text: "Active in the last day",
      chartColor: "rgba(34, 197, 94, 0.8)",
    },
    yellow: {
      color: "bg-yellow-500",
      text: "Active in the last 3 days",
      chartColor: "rgba(234, 179, 8, 0.8)",
    },
    orange: {
      color: "bg-orange-500",
      text: "Active in the last month",
      chartColor: "rgba(249, 115, 22, 0.8)",
    },
    gray: {
      color: "bg-gray-400",
      text: "Inactive (over a month ago)",
      chartColor: "rgba(156, 163, 175, 0.8)",
    },
  };

  // Process data for chart
  const chartData = useMemo(() => {
    const activityCounts = {
      green: 0,
      yellow: 0,
      orange: 0,
      gray: 0,
    };

    // Count users by activity status
    userData.forEach((user) => {
      if (user.activityStatus in activityCounts) {
        activityCounts[user.activityStatus as keyof typeof activityCounts]++;
      }
    });

    return {
      labels: Object.values(activityStatusMap).map((status) => status.text),
      datasets: [
        {
          data: [
            activityCounts.green,
            activityCounts.yellow,
            activityCounts.orange,
            activityCounts.gray,
          ],
          backgroundColor: [
            activityStatusMap.green.chartColor,
            activityStatusMap.yellow.chartColor,
            activityStatusMap.orange.chartColor,
            activityStatusMap.gray.chartColor,
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(234, 179, 8, 1)",
            "rgba(249, 115, 22, 1)",
            "rgba(156, 163, 175, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [userData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Calculate metrics and percentages
  const totalUsers = userData.length;
  const activeUsers = userData.filter(
    (u) => u.activityStatus === "green" || u.activityStatus === "yellow",
  ).length;
  const dormantUsers = userData.filter(
    (u) => u.activityStatus === "gray",
  ).length;

  const activePercentage =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const dormantPercentage =
    totalUsers > 0 ? Math.round((dormantUsers / totalUsers) * 100) : 0;

  return (
    <div>
      {/* Summary metrics */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="text-sm font-medium text-blue-700">Total Users</div>
          <div className="text-3xl font-bold text-blue-900">{totalUsers}</div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
          <div className="text-sm font-medium text-green-700">Active Users</div>
          <div className="text-3xl font-bold text-green-900">{activeUsers}</div>
          <div className="mt-1 text-xs text-green-600">
            {activePercentage}% of total
          </div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="text-sm font-medium text-red-700">Dormant Users</div>
          <div className="text-3xl font-bold text-red-900">{dormantUsers}</div>
          <div className="mt-1 text-xs text-red-600">
            {dormantPercentage}% of total
          </div>
        </div>
      </div>

      {/* Pie chart */}
      <div className="flex justify-center">
        <div style={{ maxWidth: "400px", maxHeight: "400px" }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">User Activity Breakdown</div>
          <div className="mt-2 space-y-2">
            {Object.entries(activityStatusMap).map(([key, status]) => (
              <div key={key} className="flex items-center">
                <div
                  className={`h-4 w-4 rounded-full ${status.color} mr-2`}
                ></div>
                <span>{status.text}:</span>
                <span className="ml-auto font-medium">
                  {userData.filter((u) => u.activityStatus === key).length}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Retention Insights</div>
          <div className="mt-2 space-y-1">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                {activePercentage > 0
                  ? Math.round(
                      (userData.filter((u) => u.activityStatus === "green")
                        .length /
                        totalUsers) *
                        100,
                    )
                  : 0}
                %
              </span>{" "}
              of users are active within the last day
            </div>
            <div className="text-sm">
              <span className="font-medium text-yellow-500">
                {totalUsers > 0
                  ? Math.round(
                      (userData.filter((u) => u.activityStatus === "yellow")
                        .length /
                        totalUsers) *
                        100,
                    )
                  : 0}
                %
              </span>{" "}
              of users are active in the last 3 days
            </div>
            <div className="text-sm">
              <span className="font-medium text-orange-500">
                {Math.round(
                  (userData.filter((u) => u.activityStatus === "orange")
                    .length /
                    totalUsers) *
                    100,
                ) || 0}
                %
              </span>{" "}
              of users were active last month
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">
                {dormantPercentage}%
              </span>{" "}
              of users haven't been active for over a month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRetentionChart;
