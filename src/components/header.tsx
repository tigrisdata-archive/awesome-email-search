'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    name: 'Send',
    path: '/send',
  },
  {
    name: 'Search',
    path: '/search',
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-5xl z-20">
      <div className="w-full items-center justify-between text-xl lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <Link className="flex gap-2 items-center" href="/">
            <Image
              src="/email.svg"
              alt="Email Logo"
              className="dark:invert"
              width={24}
              height={24}
              priority
            />
            <span>Awesome Email Search</span>
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 flex w-full items-start justify-center lg:justify-start py-4 lg:py-0 lg:static h-auto lg:w-auto bg-gray-950 lg:bg-transparent lg:bg-none z-10 text-white">
          <span className="flex self-start">With</span>
          <a
            className="pointer-events-none flex place-items-start gap-2 lg:pointer-events-auto lg:p-0 ml-2 mr-2"
            href="https://resend.com?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/resend.svg"
              alt="Resend Logo"
              className="invert-0"
              width={100}
              height={24}
              priority
            />
          </a>
          <span className="flex self-start">&amp;</span>
          <a
            className="pointer-events-none flex place-items-center gap-2 lg:pointer-events-auto lg:p-0 ml-2"
            href="https://resend.com?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/tigris.svg"
              alt="Tigris Logo"
              className="invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="flex w-full mt-20 lg:top-auto max-w-5xl justify-center lg:justify-start space-x-20 lg:pl-4 lg:mt-4">
        {links.map((link) => {
          return (
            <p key={link.name}>
              <Link
                href={link.path}
                className={pathname === link.path ? 'font-bold underline' : ''}
              >
                {link.name}
              </Link>
            </p>
          );
        })}
      </div>
    </header>
  );
}
