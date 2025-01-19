import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import React from "react";
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default MyApp;
