import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import { Inter, Kalam } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';

const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fontHandwriting = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-handwriting',
});


export const metadata: Metadata = {
  title: 'something i couldnt say',
  description: 'i cant say it to you, so i create this website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHandwriting.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1 flex">{children}</main>
          <footer className="w-full border-t border-border py-4">
            <div className="container text-center text-sm text-muted-foreground">
              Created by nerrow
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
