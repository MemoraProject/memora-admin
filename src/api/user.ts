import {
  User,
  UserCreationPayload,
  UserUpdatePayload,
  PagedResult,
  UserParams,
  UserWithActivityStatus,
} from "@/models/user";
import api from "./axios";

const BASE_URL = "/User";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(BASE_URL);
  return response.data;
};

export const createUser = async (user: UserCreationPayload): Promise<User> => {
  const response = await api.post<User>(BASE_URL, user);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`${BASE_URL}/${id}`);
  return response.data;
};

export const getUserWithFullDetails = async (id: string): Promise<User> => {
  const response = await api.get<User>(`${BASE_URL}/${id}/full-details`);
  return response.data;
};

export const updateUser = async (
  id: number,
  user: UserUpdatePayload,
): Promise<User> => {
  const response = await api.put<User>(`${BASE_URL}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const monthlyUserGrowthStatistics = async (months: number) => {
  const response = await api.get(
    `user/monthly-growth-statistics?months=${months}`,
  );
  return response.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post(`/Auth/login`, {
    email,
    password,
  });
  if (response.status === 200) {
    localStorage.setItem("adminToken", response.data.token);
  } else {
    throw new Error("Invalid credentials");
  }
  return response.data;
};

export const getUsersWithActivityStatus = async (
  params: UserParams,
): Promise<UserWithActivityStatus[]> => {
  const queryParams = new URLSearchParams();

  if (params.pageNumber)
    queryParams.append("pageNumber", params.pageNumber.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
  if (params.activityStatus)
    queryParams.append("activityStatus", params.activityStatus);
  if (params.hasSubscription !== undefined)
    queryParams.append("hasSubscription", params.hasSubscription.toString());
  if (params.fromDate) queryParams.append("fromDate", params.fromDate);
  if (params.toDate) queryParams.append("toDate", params.toDate);

  const response = await api.get<UserWithActivityStatus[]>(
    `${BASE_URL}/with-activity-status?${queryParams.toString()}`,
  );
  return response.data;
};
