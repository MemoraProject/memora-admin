export type Payment = {
  id: number,
  amount: number,
  paymentDate: string,
  dateCreated: string,
  status: string,
  description: string | null,
  userSubscription: string | null
}

export type PaymentCreationPayload = Omit<Payment, 'id'>;

export type PaymentUpdatePayload = Partial<Payment>;

