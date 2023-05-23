'use client';

import { FormEvent, useState } from 'react';
import { EmailResult, EmailStatus } from '@/lib/shared-email-types';
import Row from './row';
import { Alert } from './alert';
import MultiSelect from './multi-select';
import { searchEmail } from '@/lib/email-search';

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
      {searchError && (
        <Alert
          title="A problem occured with the search"
          type="ERROR"
          text={searchError}
        />
      )}

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
          className="w-36 px-4 font-semibold text-sm bg-green-50 dark:bg-gray-800 text-white rounded-md shadow-sm opacity-100 hover:bg-green-300 hover:dark:bg-gray-600"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="mt-10 relative overflow-x-auto shadow-md sm:rounded-lg w-5/6 lg:w-4/6">
        {searching && <p>Searching...</p>}
        {emailResults.length === 0 && <p>No email results found</p>}
        {!searching && emailResults.length > 0 && (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-600 dark:bg-gray-900 dark:text-gray-400">
              <tr className="text-left">
                <th scope="col" className="px-6 py-3">
                  To
                </th>
                <th scope="col" className="px-6 py-3">
                  From
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Body
                </th>
                <th scope="col" className="px-6 py-3">
                  Sent
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {emailResults.map((email) => {
                return (
                  <tr
                    key={email.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {email.to.join(', ')}
                    </th>
                    <td className="px-6 py-4">{email.from}</td>
                    <td className="px-6 py-4">{email.subject}</td>
                    <td className="px-6 py-4">{`${email.body.substring(
                      0,
                      10
                    )}...`}</td>
                    <td className="px-6 py-4">
                      {email.createdAt.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{EmailStatus[email.status]}</td>
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
