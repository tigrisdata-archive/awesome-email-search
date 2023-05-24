import { EmailSearchParams } from './shared-email-types';
import { buildUri } from './link-builder';

export const searchEmail = async (searchParams: EmailSearchParams) => {
  // Use NEXT_PUBLIC_HOST if present. Fallback to NEXT_PUBLIC_VERCEL_URL if deployed to Vercel
  const baseUri = process.env.NEXT_PUBLIC_HOST
    ? process.env.NEXT_PUBLIC_HOST
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  const uri = buildUri({ baseUri, params: searchParams });
  const response = await fetch(uri);

  return response;
};

export const sendEmail = async (formData: Record<string, string>) => {
  const response = await fetch('/api/email', {
    method: 'POST',
    body: new URLSearchParams(formData),
  });
  return response;
};
