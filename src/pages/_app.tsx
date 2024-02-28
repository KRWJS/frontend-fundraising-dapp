// Packages
import { MetaMaskProvider } from 'metamask-react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Inter } from 'next/font/google';

// Layouts
import Header from '@/UI/layouts/Header/Header';

// Styles
import '@/UI/stylesheets/_global.scss';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({
  Component,
  pageProps: { ...pageProps }
}: AppProps) {
  return (
    <div className={`${inter.className} appWrapper`}>
      <MetaMaskProvider>
        <Header />
        <Component {...pageProps} />
      </MetaMaskProvider>
      <ToastContainer theme='light' newestOnTop={true} autoClose={3500} />
    </div>
  );
}
