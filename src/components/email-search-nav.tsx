import { buildQuery } from '@/lib/link-builder';
import { EmailSearchParams } from '@/lib/shared-email-types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { SearchMeta } from '@tigrisdata/core';
import Link from 'next/link';

export type EmailSearchNavProps = {
  searchMeta: SearchMeta;
  searchParams: EmailSearchParams;
  OnPageNav: (pageNumber: number) => void;
  className?: string;
};

export const EmailSearchNav = ({
  searchMeta,
  searchParams,
  OnPageNav,
  className,
}: EmailSearchNavProps) => {
  const NavLink = ({
    toPage,
    navText,
    className,
  }: {
    toPage: number;
    navText: string | number | React.ReactElement;
    className?: string;
  }) => {
    return (
      <Link
        className={className}
        onClick={() => OnPageNav(toPage)}
        href={
          '/search?' +
          buildQuery({
            page: toPage,
            query: searchParams.query,
            sortdir: searchParams.sortdir,
            statuses: searchParams.statuses,
          })
        }
      >
        {navText}
      </Link>
    );
  };

  const NavLinks = ({
    pageCount,
    current,
  }: {
    pageCount: number;
    current: number;
  }) => {
    const navs = [];
    for (let i = 1; i <= pageCount; ++i) {
      navs.push(
        <NavLink
          key={`nav-link-${i}`}
          navText={i}
          toPage={i}
          className={`${i === current ? 'font-bold underline' : ''}`}
        />
      );
    }

    return <div className="flex gap-2">{navs}</div>;
  };

  return (
    <div className={`${className}`}>
      <nav className={`flex justify-center items-center gap-2 mt-5 text-sm`}>
        {searchMeta.page.current > 1 && (
          <NavLink
            navText={<ChevronLeftIcon className="w-4 h-4" />}
            toPage={searchMeta.page.current - 1}
          />
        )}
        <NavLinks
          pageCount={searchMeta.totalPages}
          current={searchMeta.page.current}
        />
        {searchMeta.page.current < searchMeta.totalPages && (
          <NavLink
            navText={<ChevronRightIcon className="w-4 h-4" />}
            toPage={searchMeta.page.current + 1}
          />
        )}
      </nav>
      <div className="flex justify-center items-center mt-2 text-xs">
        Results {searchMeta.page.size * (searchMeta.page.current - 1) + 1} to{' '}
        {Math.min(
          searchMeta.found,
          searchMeta.page.current * searchMeta.page.size
        )}{' '}
        of {searchMeta.found}
      </div>
    </div>
  );
};
