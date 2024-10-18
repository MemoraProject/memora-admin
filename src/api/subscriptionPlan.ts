import axios from 'axios';
import { SubscriptionPlan, SubcriptionPlanCreationPayload, SubscriptionPlanUpdatePayload } from '../models/subscriptionPlan';

const BASE_URL = 'https://api.memora.vn/SubscriptionPlan';

export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await axios.get<SubscriptionPlan[]>(BASE_URL);
  return response.data;
};

export const createSubscriptionPlan = async (plan: SubcriptionPlanCreationPayload): Promise<SubscriptionPlan> => {
  const response = await axios.post<SubscriptionPlan>(BASE_URL, plan);
  return response.data;
};

export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan> => {
  const response = await axios.get<SubscriptionPlan>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateSubscriptionPlan = async (id: string, plan: SubscriptionPlanUpdatePayload): Promise<SubscriptionPlan> => {
  const response = await axios.put<SubscriptionPlan>(`${BASE_URL}/${id}`, plan);
  return response.data;
};

export const deleteSubscriptionPlan = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};