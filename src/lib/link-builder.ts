import { EmailSearchParams } from './shared-email-types';

export const buildQuery = (params: EmailSearchParams): string => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
};

export const buildUri = ({
  baseUri,
  params,
}: {
  baseUri: string;
  params: EmailSearchParams;
}): URL => {
  return new URL(`${baseUri}/api/email?${buildQuery(params)}`);
};
