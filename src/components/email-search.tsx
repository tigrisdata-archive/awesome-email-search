'use client';

import { FormEvent, useState } from 'react';
import { EmailResult, EmailStatus } from '@/lib/shared-email-types';
import Row from './row';
import { Alert } from './alert';
import MultiSelect from './multi-select';
import { searchEmail } from '@/lib/email-search';

const EmailStatusLabel = ({ status }: { status: EmailStatus }) => {
  let statusCss = '';
  switch (status) {
    case EmailStatus.Sent:
      statusCss = 'bg-orange-200 text-orange-950';
      break;
    case EmailStatus.Delivered:
      statusCss = 'bg-green-200 text-green-950';
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

export type EmailSearchProps = {
  query: string;
  statuses: string;
  emails: EmailResult[];
};
export const EmailSearch = (props: EmailSearchProps) => {
  const [searchQueryValue, setSearchQueryValue] = useState<string>(props.query);
  const [statusesValue, setStatusesValue] = useState<string>(props.statuses);
  const [searchError, setSearchError] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>(props.emails);
  const handleStatusFacetChange = (value: string[]) => {
    setStatusesValue(value.join(','));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    setSearching(true);

    const response = await searchEmail({
      query: searchQueryValue,
      statuses: statusesValue,
    });

    if (response.status === 200) {
      const json = await response.json();
      setEmailResults(json.results);
    } else {
      const json = await response.json();
      setSearchError(json.error);
    }

    setSearching(false);
  };

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
        className="flex flex-col lg:flex-row gap-6 w-5/6 lg:w-4/6"
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
        <button
          disabled={searching}
          className="flex-grow lg:grow-0 h-9 lg:w-36 px-4 font-semibold text-sm bg-green-50 dark:bg-gray-800 text-white rounded-md shadow-sm opacity-100 hover:bg-green-300 hover:dark:bg-gray-600"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="mt-10 relative overflow-x-scroll shadow-md sm:rounded-lg w-5/6 lg:w-4/6 mx-4">
        {searching && <p>Searching...</p>}
        {!searching && emailResults.length === 0 && (
          <p>No email results found</p>
        )}
        {!searching && emailResults.length > 0 && (
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
                  className="h-8 border-t border-b border-slate-600 px-3 text-xs font-semibold text-slate-200 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                >
                  Body
                </th>
                <th
                  scope="col"
                  className="text-right h-8 border-t border-b border-slate-600 px-3 text-xs font-semibold text-slate-200 first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                >
                  Sent
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
                    <td className="h-10 truncate border-b border-slate-600 px-3 text-sm">{`${email.body.substring(
                      0,
                      10
                    )}...`}</td>
                    <td className="h-10 truncate border-b border-slate-600 px-3 text-sm">
                      {email.createdAt.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Row>
  );
};
