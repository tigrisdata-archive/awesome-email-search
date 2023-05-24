import Header from '@/components/header';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Awesome Email Search with Resend & Tigris Search',
  description:
    'An example of sending emails with Resend and indexing & searching those emails with Tigris Search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-normal p-4 xl:p-24 overflow-x-hidden lg:overflow-x-auto">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
