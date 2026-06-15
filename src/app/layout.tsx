import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'Hệ thống học tập trực tuyến với các khóa học TypeScript, React và nhiều hơn nữa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm mt-16">
          <p>© 2024 LMS · Xây dựng với Next.js 14 + TypeScript + Tailwind CSS</p>
        </footer>
      </body>
    </html>
  );
}
