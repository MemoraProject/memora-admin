import axios from 'axios';
import { SubscriptionPlan, SubcriptionPlanCreationPayload, SubscriptionPlanUpdatePayload } from '../models/subscriptionPlan';

const BASE_URL = 'https://api.memora.vn/api/SubscriptionPlan';

const logApiCall = async (apiCall: () => Promise<any>, method: string, url: string, data?: any) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await logApiCall(() => axios.get<SubscriptionPlan[]>(BASE_URL), 'GET', BASE_URL);
  return response.data;
};

export const createSubscriptionPlan = async (plan: SubcriptionPlanCreationPayload): Promise<SubscriptionPlan> => {
  const response = await axios.post<SubscriptionPlan>(BASE_URL, plan);
  return response.data;
};

export const getSubscriptionPlanById = async (id: number): Promise<SubscriptionPlan> => {
  const response = await axios.get<SubscriptionPlan>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateSubscriptionPlan = async (id: number, plan: SubscriptionPlanUpdatePayload): Promise<SubscriptionPlan> => {
  const response = await axios.put<SubscriptionPlan>(`${BASE_URL}/${id}`, plan);
  return response.data;
};

export const deleteSubscriptionPlan = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};