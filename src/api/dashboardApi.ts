import api from "./axios";
import { apiRevenueCat } from "./axios";

// Constants
const REVENUECAT_PROJECT_ID = "87394d93"; // Use your actual project ID

export const monthlyUserGrowthStatistics = async (months: number) => {
  const response = await api.get(
    `user/monthly-growth-statistics?months=${months}`,
  );
  return response.data;
};

export const getDashboardCard = async () => {
  const response = await api.get(`dashboard`);
  return response.data;
};

export const getTodayRevenue = async () => {
  const response = await api.get(`dashboard/today-revenue`);
  return response.data;
};

export const getRevenueByType = async () => {
  const response = await api.get(`dashboard/revenue-by-type`);
  return response.data;
};

export const getSubscriptionDashboard = async (timerange: string) => {
  const response = await api.get(
    `dashboard/subscription-dashboard?months=${timerange}`,
  );
  return response.data;
};

// Get total users count
export const getTotalUsersCount = async () => {
  try {
    const response = await api.get("user");
    return response.data.length; // Return the total count of users
  } catch (error) {
    console.error("Error fetching total users count:", error);
    return 0;
  }
};

// RevenueCat API functions - Direct calls to RevenueCat

/**
 * Get overview metrics for a project directly from RevenueCat
 */
export const getRevenueCatOverviewMetrics = async () => {
  try {
    const response = await apiRevenueCat.get(
      `/projects/${REVENUECAT_PROJECT_ID}/metrics/overview`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching RevenueCat overview metrics:", error);
    throw error;
  }
};

/**
 * Get customer data directly from RevenueCat
 */
export const getRevenueCatCustomer = async (customerId: string) => {
  try {
    const response = await apiRevenueCat.get(
      `/projects/${REVENUECAT_PROJECT_ID}/customers/${customerId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching RevenueCat customer ${customerId}:`, error);
    throw error;
  }
};

// Functions that use backend API to get RevenueCat data
export const getUserActivityMetrics = async () => {
  const response = await api.get(`dashboard/user-activity`);
  return response.data;
};

export const getRevenueCatUserProfile = async (userId: string) => {
  const response = await api.get(`dashboard/user-profile?userId=${userId}`);
  return response.data;
};

export const getRevenueCatSubscriptionStatus = async (userId: string) => {
  const response = await api.get(
    `dashboard/subscription-status?userId=${userId}`,
  );
  return response.data;
};

export const getMetricsHistory = async (
  metricName: string,
  fromDate: string,
  toDate: string,
) => {
  const response = await api.get(
    `dashboard/metrics-history?metricName=${metricName}&fromDate=${fromDate}&toDate=${toDate}`,
  );
  return response.data;
};

export const getLatestMetrics = async (metricNames: string[]) => {
  const queryParams = metricNames
    .map((name) => `metricNames=${name}`)
    .join("&");
  const response = await api.get(`dashboard/latest-metrics?${queryParams}`);
  return response.data;
};

export const refreshRevenueCatCache = async () => {
  const response = await api.post(`dashboard/refresh-cache`);
  return response.data;
};
