import Image from 'next/image';

export default function Row({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-between w-full pt-16">
      {children}
    </section>
  );
}
