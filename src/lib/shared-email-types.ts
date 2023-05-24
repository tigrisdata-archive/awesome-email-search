import { SearchMeta } from '@tigrisdata/core';

export type EmailSearchParams = {
  query?: string;
  statuses?: string;
  sortdir?: SortDirection;
  page?: number;
};

export enum EmailStatus {
  Sent,
  Delivered,
  DeliveryDelayed,
  Complained,
  Bounced,
  Clicked,
  Opened,
}

export enum TestEmailStatus {
  Delivered,
  Complained,
  Bounced,
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
