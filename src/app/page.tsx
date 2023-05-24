import Row from '@/components/row';
import Image from 'next/image';

export default function Home() {
  return (
    <Row>
      <div className="relative flex flex-col place-items-center justify-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/Tigris.svg"
          alt="Tigris Logo"
          width={180}
          height={37}
          priority
        />
        <span className="m-4">&amp;</span>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] light:invert"
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
