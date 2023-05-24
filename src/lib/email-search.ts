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
    // NEXT_PUBLIC_VERCEL_URL is used if deployed to Vercel
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_HOST;
    const response = await fetch(
      `${baseUrl}/api/email?search=${query}&statuses=${statuses}&sortdir=${sortDir}`
    );

    return response;
  }
);
