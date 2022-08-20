import "../styles/globals.css";
import type { AppProps } from "next/app";
import UserAuth from "../utils/UserAuth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserAuth>
      <Component {...pageProps} />
    </UserAuth>
  );
}

export default MyApp;
