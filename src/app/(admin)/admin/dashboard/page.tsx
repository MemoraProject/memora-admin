"use client";
import React, { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import styles from "./Dashboard.module.css";
import SubscriptionChartContainer from "../components/dashboard/SubscriptionChartContainer";
import UserRetentionChartContainer from "../components/dashboard/UserRetentionChartContainer";
import { getDashboardCard } from "@/api/dashboardApi";
import { getAllUsers } from "@/api/user";

interface DashboardData {
  title: string;
  value: number;
  percentage: number;
  trendData: number[];
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard cards data
        const dashboardResponse = await getDashboardCard();
        setDashboardData(dashboardResponse);

        // Fetch total users count
        const users = await getAllUsers();
        setTotalUsers(users.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return (
    <ContentLayout title="Dashboard">
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {/* Total Users Card */}
        <DashboardCard
          key="total-users"
          title="Total Users"
          value={totalUsers.toString()}
          percentage={0}
          trendData={[]}
        />

        {/* Other Dashboard Cards */}
        {dashboardData.slice(1, 3).map((item, index) => (
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
        <SubscriptionChartContainer />
      </div>

      <div className="mb-4">
        <UserRetentionChartContainer />
      </div>
    </ContentLayout>
  );
}

export default DashboardPage;
