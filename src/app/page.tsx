import Row from '@/components/row';
import Image from 'next/image';

export default function Home() {
  return (
    <Row>
      <div className="relative flex flex-col place-items-center justify-center">
        <div className="absolute top-7 flex flex-col place-items-center justify-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-green-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#01d849] after:dark:opacity-40 before:lg:h-[360px] animate-pulse-slower animate-spin-slow"></div>
        <div className="absolute top-52 flex flex-col place-items-center justify-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#bb01ff] after:dark:opacity-40 before:lg:h-[360px] animate-pulse-slow animate-spin-slower"></div>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/tigris.svg"
          alt="Tigris Logo"
          width={180}
          height={37}
          priority
        />
        <span className="m-4">&amp;</span>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] invert dark:invert-0"
          src="/resend.svg"
          alt="Resend Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </Row>
  );
}
