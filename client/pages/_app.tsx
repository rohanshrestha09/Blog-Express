import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import UserAuth from "../utils/UserAuth";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserAuth>
        <Component {...pageProps} />
      </UserAuth>
    </QueryClientProvider>
  );
}

export default MyApp;
