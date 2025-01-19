import Head from 'next/head';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Vehicle Listings</title>
        <meta name="description" content="Find your perfect vehicle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto max-w-screen-xl px-4">
        {children}
      </main>
    </>
  );
};

export default Layout;