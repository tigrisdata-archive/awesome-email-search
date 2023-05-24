'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useDebounce } from 'use-debounce';

// Custome libs
import {
  EmailResult,
  EmailStatus,
  SearchResponse,
  SortDirection,
} from '@/lib/shared-email-types';
import { searchEmail } from '@/lib/email-search';
import useNoInitialEffect from '@/lib/use-no-initial-effect';

// components
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/react/20/solid';
import Row from './row';
import { Alert } from './alert';
import MultiSelect from './multi-select';
import { SearchMeta } from '@tigrisdata/core';
import { EmailSearchNav } from './email-search-nav';

const EmailStatusLabel = ({ status }: { status: EmailStatus }) => {
  let statusCss = '';
  switch (status) {
    case EmailStatus.Sent:
    case EmailStatus.DeliveryDelayed:
      statusCss = 'bg-orange-200 text-orange-950';
      break;
    case EmailStatus.Delivered:
    case EmailStatus.Opened:
    case EmailStatus.Clicked:
      statusCss = 'bg-green-200 text-green-950';
      break;
    case EmailStatus.Bounced:
    case EmailStatus.Complained:
      statusCss = 'bg-red-200 text-red-950';
      break;
  }
  return (
    <span
      className={`capitalize inline-flex cursor-default select-none items-center whitespace-nowrap font-semibold text-xs h-6 px-2 rounded ${statusCss}`}
    >
      {EmailStatus[status]}
    </span>
  );
};

const reviveDates = (results: EmailResult[]) => {
  return results.map((result) => {
    return {
      ...result,
      createdAt: new Date(result.createdAt),
    };
  });
};

export type EmailSearchProps = {
  query: string;
  statuses: string;
  emails: EmailResult[];
  sortDir: SortDirection;
  pageNumber: number;
  meta: SearchMeta;
};

export const EmailSearch = (props: EmailSearchProps) => {
  if (props.pageNumber <= 0) throw new Error('pageNumber must be > 0');

  const [searchQueryValue, setSearchQueryValue] = useState<string>(props.query);
  const [debouncedSearchQueryValue] = useDebounce(searchQueryValue, 500);
  const [statusesValue, setStatusesValue] = useState<string>(props.statuses);
  const [sortDir, setSortDir] = useState<SortDirection>(props.sortDir);
  const [searchMeta, setSearchMeta] = useState<SearchMeta>(props.meta);
  const [searchError, setSearchError] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>(
    reviveDates(props.emails)
  );
  const [pageNumber, setPageNumber] = useState<number>(props.pageNumber);

  const handleStatusFacetChange = (value: string[]) => {
    setStatusesValue(value.join(','));
  };

  const performSearch = useCallback(async () => {
    setSearching(true);

    const response = await searchEmail({
      query: debouncedSearchQueryValue,
      statuses: statusesValue,
      sortdir: sortDir,
      page: pageNumber,
    });

    if (response.status === 200) {
      const json = (await response.json()) as SearchResponse;
      json.results = reviveDates(json.results);
      setEmailResults(json.results);
      setSearchMeta(json.meta!);
    } else {
      const json = await response.json();
      setSearchError(json.error);
    }

    setSearching(false);
  }, [debouncedSearchQueryValue, statusesValue, sortDir, pageNumber]);

  useEffect(() => {
    if (debouncedSearchQueryValue) {
      performSearch();
    }
  }, [debouncedSearchQueryValue, performSearch]);

  useNoInitialEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performSearch, pageNumber, sortDir]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    performSearch();
  };

  function handlePageNav(pageNumber: number): void {
    setPageNumber(pageNumber);
  }

  return (
    <Row>
      <Alert
        title="A problem occured with the search"
        type="ERROR"
        text={searchError}
        open={searchError !== ''}
        onClose={() => setSearchError('')}
      />

      <h1 className="text-lg pb-4">Search</h1>

      <form
        action="/api/email"
        method="GET"
        className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="search"
          onChange={(e) => setSearchQueryValue(e.target.value)}
          defaultValue={searchQueryValue}
          readOnly={searching}
          className="rounded-lg lg:grow bg-white text-left shadow-md focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-teal-300 sm:text-sm text-slate-950 font-sans"
        />
        <input type="hidden" name="statuses" value={statusesValue} />
        <MultiSelect
          onChange={handleStatusFacetChange}
          options={Object.keys(EmailStatus).filter((status) =>
            isNaN(Number(status))
          )}
        />
      </form>

      <div className="mt-10 relative overflow-x-scroll shadow-md sm:rounded-lg  w-full max-w-5xl mx-4">
        {searching && <p>Searching...</p>}
        {!searching && emailResults.length === 0 && (
          <p>No email results found</p>
        )}
        {!searching && emailResults.length > 0 && (
          <section>
            <table className="min-w-full border-separate border-spacing-0 border-none text-left z-0">
              <thead className="h-8 rounded-md bg-zinc-900">
                <tr className="text-left text-slate-200 text-xs font-semibold">
                  <th
                    scope="col"
                    className="w-[100px] h-8 border-t border-b border-slate-600 px-3 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="w-[302px] h-8 border-t border-b border-slate-600 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    To
                  </th>
                  <th
                    scope="col"
                    className=" h-8 border-t border-b border-slate-600 px-3 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    From
                  </th>
                  <th
                    scope="col"
                    className="h-8 border-t border-b border-slate-600 px-3 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="flex items-center text-right h-8 border-t border-b border-slate-600 px-3 text-xs font-semibold text-slate-200 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    <span>Created</span>
                    <span
                      className="ml-2 w-4 h-4 cursor-pointer"
                      title={sortDir}
                      onClick={() =>
                        setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
                      }
                    >
                      {sortDir === 'desc' ? (
                        <ChevronDoubleDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDoubleUpIcon className="w-4 h-4" />
                      )}
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="h-8 border-t border-b border-slate-600 px-3 text-xs font-semibold text-slate-200 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                  >
                    Body
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailResults.map((email) => {
                  return (
                    <tr key={email.id} className="text-slate-200">
                      <td className="h-10 truncate border-b border-slate-600 px-3 text-sm">
                        <EmailStatusLabel status={email.status} />
                      </td>
                      <td
                        scope="row"
                        className="h-10 truncate border-b border-slate-600 px-3 text-sm font-medium whitespace-nowrap dark:text-white"
                      >
                        {email.to.join(', ')}
                      </td>
                      <td className="h-10 truncate border-b border-slate-600 px-3 text-sm">
                        {email.from}
                      </td>
                      <td className="h-10 truncate border-b border-slate-600 px-3 text-sm">
                        {email.subject}
                      </td>
                      <td
                        className="h-10 truncate border-b border-slate-600 px-3 text-sm"
                        title={DateTime.fromJSDate(email.createdAt).toFormat(
                          'ff'
                        )}
                      >
                        {DateTime.fromJSDate(email.createdAt).toRelative()}
                      </td>
                      <td
                        className="h-10 truncate border-b border-slate-600 px-3 text-sm"
                        title={email.body}
                      >{`${email.body.substring(0, 10)}...`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <EmailSearchNav
              OnPageNav={handlePageNav}
              searchMeta={searchMeta}
              searchParams={{
                query: searchQueryValue,
                page: pageNumber,
                sortdir: sortDir,
                statuses: statusesValue,
              }}
            />
          </section>
        )}
      </div>
    </Row>
  );
};
