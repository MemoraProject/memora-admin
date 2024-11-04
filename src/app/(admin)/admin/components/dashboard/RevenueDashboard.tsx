"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import styles from "./RevenueDashboard.module.css";
import { getRevenueByType, getTodayRevenue } from "@/api/dashboardApi";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
interface RevenueData {
  revenueType1Month: number;
  revenueType3Month: number;
  revenueType12Month: number;
}
interface RevenueByTypeData {
  date: string;
  oneMonthRevenue: number;
  threeMonthsRevenue: number;
  twelveMonthsRevenue: number;
}
const formatCurrency = (amount: number) => {
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + "K";
  }
  return amount.toString();
};

const RevenueDashboard: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [revenueByTypeData, setRevenueByTypeData] = useState<
    RevenueByTypeData[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayData = await getTodayRevenue();
        setRevenueData(todayData);

        const revenueByTypeData = await getRevenueByType();
        setRevenueByTypeData(revenueByTypeData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };

    fetchData();
  }, []);
  const totalRevenue = revenueData
    ? revenueData.revenueType1Month +
      revenueData.revenueType3Month +
      revenueData.revenueType12Month
    : 0;
  const gaugeChartData = {
    datasets: [
      {
        data: revenueData
          ? [
              revenueData.revenueType12Month,
              revenueData.revenueType3Month,
              revenueData.revenueType1Month,
              0, // Giữ lại giá trị 0 cho phần trống của biểu đồ
            ]
          : [0, 0, 0, 0],
        backgroundColor: ["#fbbf24", "#3b82f6", "#ef4444", "#e5e7eb"],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      },
    ],
  };

  const gaugeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const initializeMonthlyData = () => {
    return months.map((month) => ({
      date: `2024-${months.indexOf(month) + 1}-01`,
      oneMonthRevenue: 0,
      threeMonthsRevenue: 0,
      twelveMonthsRevenue: 0,
    }));
  };
  const mergeDataWithAllMonths = (data: RevenueByTypeData[]) => {
    const allMonthsData = initializeMonthlyData();
    data.forEach((item) => {
      const monthIndex = new Date(item.date).getMonth();
      allMonthsData[monthIndex] = item;
    });
    return allMonthsData;
  };
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Premium 1 tháng",
        data: mergeDataWithAllMonths(revenueByTypeData).map(
          (item) => item.oneMonthRevenue,
        ),
        backgroundColor: "#ef4444",
      },
      {
        label: "Premium 3 tháng",
        data: mergeDataWithAllMonths(revenueByTypeData).map(
          (item) => item.threeMonthsRevenue,
        ),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Premium 12 tháng",
        data: mergeDataWithAllMonths(revenueByTypeData).map(
          (item) => item.twelveMonthsRevenue,
        ),
        backgroundColor: "#fbbf24",
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
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Revenue by customer type",
      },
    },
  };

  return (
    <div className="bg-gray-50 mb-4">
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-1 rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Today's Revenue</h2>
            <div className="relative h-48 w-full">
              <Doughnut data={gaugeChartData} options={gaugeChartOptions} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold">
                {formatCurrency(totalRevenue)}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {revenueData && (
                <>
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 rounded bg-yellow-400"></span>
                    <span>Premium 12 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 rounded bg-blue-500"></span>
                    <span>Premium 3 tháng</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 h-4 w-4 rounded bg-red-500"></span>
                    <span>Premium 1 tháng</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Revenue by customer type
              </h2>
              <select className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                <option>Jan 2024 - Dec 2024</option>
              </select>
            </div>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
