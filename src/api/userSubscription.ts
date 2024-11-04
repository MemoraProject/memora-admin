import { UserSubscription } from "@/models/userSubscription";

import api from "./axios";

const BASE_URL = "/userSubscription";

export const getAllUserSubscriptions = async (): Promise<
  UserSubscription[]
> => {
  const response = await api.get<UserSubscription[]>(BASE_URL);
  return response.data;
};

//get detail user subscription
export const getUserSubscriptionById = async (
  id: number,
): Promise<UserSubscription> => {
  const response = await api.get<UserSubscription>(`${BASE_URL}/${id}`);
  return response.data;
};
