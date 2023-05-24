import { EmailSearch } from '@/components/email-search';
import { searchEmail } from '@/lib/email-api';
import { EmailSearchParams, SearchResponse } from '@/lib/shared-email-types';

export default async function Search({
  searchParams,
}: {
  searchParams: EmailSearchParams;
}) {
  const {
    query = '',
    statuses = '',
    sortdir = 'desc',
    page = 1,
  } = searchParams;

  const response = await searchEmail({
    query,
    statuses,
    sortdir,
    page,
  });
  const json = (await response.json()) as SearchResponse;

  if (json.meta === undefined) {
    throw new Error('"json.meta" should not be "undefined"');
  }

  return (
    <EmailSearch
      emails={json.results || []}
      query={query}
      statuses={statuses}
      sortDir={sortdir}
      pageNumber={page}
      meta={json.meta}
    />
  );
}
