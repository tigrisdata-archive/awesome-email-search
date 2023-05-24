import { SearchMeta } from '@tigrisdata/core';

export const EMAIL_CACHE_TAG = 'emails';

export type EmailSearchParams = {
  query?: string;
  statuses?: string;
  sortdir?: SortDirection;
  page?: number;
};

export enum EmailStatus {
  Sent = 'Sent',
  Delivered = 'Delivered',
  DeliveryDelayed = 'DeliveryDelayed',
  Complained = 'Complained',
  Bounced = 'Bounced',
  Clicked = 'Clicked',
  Opened = 'Opened',
}

export enum TestEmailStatus {
  Delivered = 'Delivered',
  Complained = 'Complained',
  Bounced = 'Bounced',
}

export type SearchResponse = {
  results: EmailResult[];
  meta: undefined | SearchMeta;
  error: undefined | string;
};

export interface EmailResult {
  id?: string;

  firstTo: string;

  to: string[];

  from: string;

  subject: string;

  body: string;

  status: EmailStatus;

  createdAt: Date;
}

export type SortDirection = 'asc' | 'desc';
