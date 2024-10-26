"use client";
import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import styles from "./Dashboard.module.css";
import RevenueDashboard from "../components/dashboard/RevenueDashboard";
import UserChartContainer from "../components/dashboard/UserChartContainer";
import SubscriptionChartContainer from "../components/dashboard/SubscriptionChartContainer";
import UserActivityHeatmap from "../components/dashboard/UserActivityHeatmap";
import { getDashboardCard } from "@/api/dashboardApi";

interface DashboardData {
  title: string;
  value: number;
  percentage: number;
  trendData: number[];
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardCard(); // Điều chỉnh URL API nếu cần

        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <ContentLayout title="Dashboard">
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {dashboardData.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            value={item.value.toString()}
            percentage={item.percentage}
            trendData={item.trendData}
          />
        ))}
      </div>
      <div className="mb-4">
        <RevenueDashboard />
      </div>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <UserChartContainer />
        </div>
        <div className="w-full lg:w-1/2">
          <SubscriptionChartContainer />
        </div>
      </div>
      {/* <div className="mb-4">
        <UserActivityHeatmap />
      </div> */}
    </ContentLayout>
  );
}

export default DashboardPage;
