import Link from 'next/link';
import Row from './row';
import Image from 'next/image';

export default function Footer() {
  return (
    <Row>
      <Link
        className="flex items-center gap-2 mb-24 lg:mb-5 z-20"
        href="https://github.com/tigrisdata-community/awesome-email-search"
      >
        <Image
          src="/github.svg"
          alt="GitHub logo"
          width={24}
          height={24}
          className="dark:invert"
        />{' '}
        Grab the code on GitHub
      </Link>
    </Row>
  );
}
