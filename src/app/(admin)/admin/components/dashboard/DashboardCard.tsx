"use client";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import styles from "./DashboardCard.module.css";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
);

interface DashboardCardProps {
  title: string;
  value: string;
  percentage: number;
  trendData: number[];
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  percentage,
  trendData,
}) => {
  const gaugeChartData = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ["#FF69B4", "#E6E6FA"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const gaugeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const trendChartData = {
    labels: new Array(trendData.length).fill(""),
    datasets: [
      {
        data: trendData,
        borderColor: "#20B2AA",
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="flex rounded-lg bg-white p-4 shadow">
      <div className="w-1/2 pr-4">
        <div className="relative mx-auto h-32 w-32">
          <Doughnut data={gaugeChartData} options={gaugeChartOptions} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold">
            {value}
          </div>
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-between">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {/* <div className="h-16 mb-2">
          <Line data={trendChartData} options={trendChartOptions} />
        </div> */}
        {/* <div className="text-right font-semibold text-green-500">
          {percentage}% ▲
        </div> */}
      </div>
    </div>
  );
};

export default DashboardCard;
