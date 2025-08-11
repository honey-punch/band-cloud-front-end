import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import RQProvider from '@/app/_component/RQProvider';
import NavBar from '@/app/_component/NavBar';
import BottomPlayer from '@/app/_component/BottomPlayer';
import CurrentAudioProvider from '@/app/_component/CurrentAudioProvider';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BAND CLOUD',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white h-screen`}
      >
        <RQProvider>
          <CurrentAudioProvider>
            <NavBar />
            <div className="p-8 overflow-y-auto h-[calc(100vh-160px)]">{children}</div>
            <BottomPlayer />
          </CurrentAudioProvider>
        </RQProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
