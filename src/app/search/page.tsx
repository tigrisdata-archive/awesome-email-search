import { EmailSearch } from '@/components/email-search';
import { searchEmail } from '@/lib/email-search';

export default async function Search({
  searchParams,
}: {
  searchParams: { query?: string; statuses?: string };
}) {
  const { query = '', statuses = '' } = searchParams;

  const response = await searchEmail({ query: query, statuses });
  const json = await response.json();

  return (
    <EmailSearch
      emails={json.results || []}
      query={query}
      statuses={statuses}
    />
  );
}
