import { EmailSearchParams } from './shared-email-types';

export const buildQuery = (params: EmailSearchParams): string => {
  return `search=${params.query}&statuses=${params.statuses}&sortdir=${params.sortdir}&page=${params.page}`;
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
