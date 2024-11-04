import {
  Payment,
  PaymentCreationPayload,
  PaymentUpdatePayload,
} from "@/models/payment";
import api from "./axios";

const BASE_URL = "/Payment";

export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await api.get<Payment[]>(BASE_URL);
  return response.data;
};

export const createPayment = async (
  payment: PaymentCreationPayload,
): Promise<Payment> => {
  const response = await api.post<Payment>(BASE_URL, payment);
  return response.data;
};

export const getPaymentById = async (id: number): Promise<Payment> => {
  const response = await api.get<Payment>(`${BASE_URL}/${id}`);
  return response.data;
};

export const updatePayment = async (
  id: number,
  payment: PaymentUpdatePayload,
): Promise<Payment> => {
  const response = await api.put<Payment>(`${BASE_URL}/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
