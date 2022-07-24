import "../styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>IT Support Help System</title>
        <meta
          name="description"
          content="An app for handling IT Support help desk tickets"
        />
      </Head>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
