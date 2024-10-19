import { Payment, PaymentCreationPayload, PaymentUpdatePayload } from '@/models/payment';
import axios from 'axios';

const BASE_URL = 'https://api.memora.vn/api/Payment';

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await axios.get<Payment[]>(BASE_URL);
  return response.data;
};

export const createPayment = async (payment: PaymentCreationPayload): Promise<Payment> => {
  const response = await axios.post<Payment>(BASE_URL, payment);
  return response.data;
};

export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await axios.get<Payment>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updatePayment = async (id: number, payment: PaymentUpdatePayload): Promise<Payment> => {
  const response = await axios.put<Payment>(`${BASE_URL}/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};