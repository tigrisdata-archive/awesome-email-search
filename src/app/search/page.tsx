import { EmailSearch } from '@/components/email-search';
import { searchEmail } from '@/lib/email-search';
import { SortDirection } from '@/lib/shared-email-types';

export default async function Search({
  searchParams,
}: {
  searchParams: { query?: string; statuses?: string; sortdir?: SortDirection };
}) {
  const { query = '', statuses = '', sortdir = 'desc' } = searchParams;

  const response = await searchEmail({
    query: query,
    statuses,
    sortDir: sortdir,
  });
  const json = await response.json();

  return (
    <EmailSearch
      emails={json.results || []}
      query={query}
      statuses={statuses}
    />
  );
}
