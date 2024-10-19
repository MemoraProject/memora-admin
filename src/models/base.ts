export type TimeTracking = {
  dateCreated: string;
  dateModified: string;
  deletedAt: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
}

const BASE_URL = 'https://api.memora.vn/subscription-plans';