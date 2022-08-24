import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import Signup from "../components/Signup";

const Home: NextPage = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) return null;

  return (
    <AppLayout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <label htmlFor="registerModal" className="btn modal-button w-24">
        open modal
      </label>

      <Signup />
    </AppLayout>
  );
};

export default Home;
