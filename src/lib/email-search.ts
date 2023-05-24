import { cache } from 'react';
import { SortDirection } from './shared-email-types';

export const searchEmail = cache(
  async ({
    query,
    statuses,
    sortDir,
  }: {
    query: string;
    statuses: string;
    sortDir: SortDirection;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/email?search=${query}&statuses=${statuses}&sortdir=${sortDir}`
    );

    return response;
  }
);
