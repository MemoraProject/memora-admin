"use client";
import React, { useState, useEffect } from "react";
import SubscriptionChart from "./SubscriptionChart";
import styles from "./SubscriptionChartContainer.module.css";
import { getRevenueCatOverviewMetrics } from "@/api/dashboardApi";
import { getAllUsers } from "@/api/user";

const SubscriptionChartContainer: React.FC = () => {
  const [directRevenueCatData, setDirectRevenueCatData] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct RevenueCat API call
      const metrics = await getRevenueCatOverviewMetrics();
      setDirectRevenueCatData(metrics);

      // Get total users count
      try {
        const users = await getAllUsers();
        setTotalUsers(users.length);
      } catch (userError) {
        console.error("Error fetching users:", userError);
        // Continue with metrics even if user count fails
      }

      // Set last updated time from RevenueCat data
      if (metrics && metrics.metrics && metrics.metrics.length > 0) {
        const latestMetric = metrics.metrics[0];
        if (latestMetric.last_updated_at) {
          const timestamp = new Date(latestMetric.last_updated_at);
          setLastUpdated(timestamp.toLocaleString());
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data from RevenueCat API.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    await fetchData();
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          SUBSCRIPTION METRICS
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="rounded-md border border-green-500 bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

      {lastUpdated && (
        <div className="mb-2 text-xs text-gray-500">
          Last updated: {lastUpdated}
        </div>
      )}

      {loading ? (
        <div className="flex h-80 items-center justify-center">
          <p>Loading data...</p>
        </div>
      ) : (
        <SubscriptionChart
          directRevenueCatData={directRevenueCatData}
          totalUsers={totalUsers}
        />
      )}
    </div>
  );
};

export default SubscriptionChartContainer;
