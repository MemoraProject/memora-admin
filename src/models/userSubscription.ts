import { TimeTracking } from "./base";
import { SubscriptionPlan } from "./subscriptionPlan";

export type UserSubscription = {
  id: number;
  userId: number;
  subscriptionPlanId: number;
  startDate: string;
  endDate: string;
  status: string;
  subscriptionPlan: SubscriptionPlan;
} & TimeTracking

export type UserSubscriptionCreationPayload = Omit<UserSubscription, 'id'>;

export type UserSubscriptionUpdatePayload = Partial<UserSubscription>;


