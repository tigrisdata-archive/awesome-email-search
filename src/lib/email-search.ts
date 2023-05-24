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
    // Use NEXT_PUBLIC_HOST if present. Fallback to NEXT_PUBLIC_VERCEL_URL if deployed to Vercel
    const baseUrl = process.env.NEXT_PUBLIC_HOST
      ? process.env.NEXT_PUBLIC_HOST
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    const response = await fetch(
      `${baseUrl}/api/email?search=${query}&statuses=${statuses}&sortdir=${sortDir}`
    );

    return response;
  }
);
