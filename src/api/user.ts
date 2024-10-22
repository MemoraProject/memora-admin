import { User, UserCreationPayload, UserUpdatePayload } from '@/models/user';
import axios from 'axios';

const BASE_URL = 'https://api.memora.vn/api/User';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(BASE_URL);
  return response.data;
};

export const createUser = async (user: UserCreationPayload): Promise<User> => {
  const response = await axios.post<User>(BASE_URL, user);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get<User>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateUser = async (id: number, user: UserUpdatePayload): Promise<User> => {
  const response = await axios.put<User>(`${BASE_URL}/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};