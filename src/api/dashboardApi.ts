import api from "./axios";

export const monthlyUserGrowthStatistics = async (months: number) => {
  const response = await api.get(`user/monthly-growth-statistics?months=${months}`);
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

