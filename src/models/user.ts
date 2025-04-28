import { TimeTracking } from "./base";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  profilePicture?: string;
  userName: string;
  phoneNumber?: string;
  email?: string;
  dateCreated: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
  deletedAt?: string;
  userEntitlements?: UserEntitlement[];
  revenueCatDetails?: UserRevenueCatDetails;
}

export interface UserEntitlement {
  id: string;
  userId: string;
  entitlementId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface UserRevenueCatDetails {
  appUserId: string;
  projectName: string;
  projectId?: string;
  lastSeenAppVersion?: string;
  country?: string;
  totalSpent: number;
  currency: string;
  lastOpened?: string;
  userSince?: string;
  lastSeenPlatformVersion?: string;
  lastSeenSdkVersion?: string;
  lastSeenLocale?: string;
  transferBehavior?: string;
  activeEntitlements: number;
  hasActiveSubscription: boolean;
  entitlementIdentifiers: string[];
  managementUrl?: string;
  allAliases: string[];
  attributes: Record<string, string>;
  subscriptionHistory: SubscriptionHistoryItem[];
}

export interface SubscriptionHistoryItem {
  type: string;
  productIdentifier: string;
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
}

export type UserCreationPayload = Omit<User, "id" | keyof TimeTracking>;

export type UserUpdatePayload = Partial<User>;

export interface UserWithActivityStatus extends User {
  activityStatus: string; // "green", "yellow", "orange", "gray"
  lastSeenAt?: string;
}

export interface UserParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  activityStatus?: string;
  hasSubscription?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
