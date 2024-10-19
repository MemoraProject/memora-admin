import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DashboardCard from "../components/dashboard/DashboardCard";
import styles from './Dashboard.module.css';
import RevenueDashboard from "../components/dashboard/RevenueDashboard";
import UserChartContainer from "../components/dashboard/UserChartContainer";
import SubscriptionChartContainer from "../components/dashboard/SubscriptionChartContainer";
import UserActivityHeatmap from "../components/dashboard/UserActivityHeatmap";

function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div className={styles.dashboardGrid}>
        <DashboardCard
          title="Subscribed User"
          value="1200"
          percentage={22.8}
          trendData={[10, 15, 7, 20, 14]}
        />
        <DashboardCard 
          title="Total Study Sets"
          value="43498"
          percentage={11.9}
          trendData={[5, 10, 15, 12, 18]}
        />
        <DashboardCard 
          title="Total Quizzes"
          value="87%"
          percentage={11.8}
          trendData={[8, 12, 9, 15, 11]}
        />
      </div>
      <div>
        <RevenueDashboard />
      </div>
      <div>
        <UserChartContainer />
      </div>
      <div>
        <SubscriptionChartContainer />
      </div>
      <div className={styles.heatmapWrapper}>
        <UserActivityHeatmap />
      </div>
    </ContentLayout>
  );
}

export default DashboardPage;