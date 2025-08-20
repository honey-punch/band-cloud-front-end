import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import RQProvider from '@/app/_component/RQProvider';
import NavBar from '@/app/_component/NavBar';
import BottomPlayer from '@/app/_component/BottomPlayer';
import { ToastContainer } from 'react-toastify';
import api from '@/entries';
import { getUserOrFalse } from '@/utils/util';
import { cookies } from 'next/headers';
import UploadProvider from '@/app/_component/UploadProvider';
import MeProvider from '@/app/_component/MeProvider';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  const cookieHeader = tokenCookie ? `token=${tokenCookie.value}` : '';

  const response = await api.get<ApiResponse<User>>(process.env.API_HOST + '/api/auth/me', {
    throwHttpErrors: false,
    headers: {
      cookie: cookieHeader,
    },
  });
  const result = await response.json().then((res) => res.result);
  const initMe = getUserOrFalse(result);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white h-screen`}
      >
        <RQProvider>
          <MeProvider initMe={initMe}>
            <UploadProvider>
              <NavBar />
              <div className="p-8 overflow-x-hidden overflow-y-auto h-[calc(100vh-160px)]">
                {children}
              </div>
              <BottomPlayer />
            </UploadProvider>
          </MeProvider>
        </RQProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
