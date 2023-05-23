import { cache } from 'react';

export const searchEmail = cache(
  async ({ query, statuses }: { query: string; statuses: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/email?search=${query}&statuses=${statuses}`
    );

    return response;
  }
);
