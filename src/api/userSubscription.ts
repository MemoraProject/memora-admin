import { UserSubscription } from '@/models/userSubscription';
import axios from 'axios';

const BASE_URL = 'https://api.memora.vn/api/userSubscription';

export const getAllUserSubscriptions = async (): Promise<UserSubscription[]> => {
  const response = await axios.get<UserSubscription[]>(BASE_URL);
  return response.data;
};

 //get detail user subscription
export const getUserSubscriptionById = async (id: number): Promise<UserSubscription> => {
  const response = await axios.get<UserSubscription>(`${BASE_URL}/${id}`);
  return response.data;
};
 