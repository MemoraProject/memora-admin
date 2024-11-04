import axios from "axios";
import {
  SubscriptionPlan,
  SubcriptionPlanCreationPayload,
  SubscriptionPlanUpdatePayload,
} from "../models/subscriptionPlan";
import api from "./axios";

const BASE_URL = "/SubscriptionPlan";

const logApiCall = async (
  apiCall: () => Promise<any>,
  method: string,
  url: string,
  data?: any,
) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllSubscriptionPlans = async (): Promise<
  SubscriptionPlan[]
> => {
  const response = await logApiCall(
    () => api.get<SubscriptionPlan[]>(BASE_URL),
    "GET",
    BASE_URL,
  );
  return response.data;
};

export const createSubscriptionPlan = async (
  plan: SubcriptionPlanCreationPayload,
): Promise<SubscriptionPlan> => {
  const response = await api.post<SubscriptionPlan>(BASE_URL, plan);
  return response.data;
};

export const getSubscriptionPlanById = async (
  id: number,
): Promise<SubscriptionPlan> => {
  const response = await api.get<SubscriptionPlan>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateSubscriptionPlan = async (
  id: number,
  plan: SubscriptionPlanUpdatePayload,
): Promise<SubscriptionPlan> => {
  const response = await api.put<SubscriptionPlan>(`${BASE_URL}/${id}`, plan);
  return response.data;
};

export const deleteSubscriptionPlan = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
