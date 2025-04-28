"use client";
import React, { useState, useEffect } from "react";
import { getUsersWithActivityStatus } from "@/api/user";
import UserRetentionChart from "./UserRetentionChart";

const UserRetentionChartContainer: React.FC = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await getUsersWithActivityStatus({});
      setUserData(users);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user retention data.");
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
        <h2 className="text-xl font-semibold text-gray-800">USER RETENTION</h2>
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
        <UserRetentionChart userData={userData} />
      )}
    </div>
  );
};

export default UserRetentionChartContainer;
