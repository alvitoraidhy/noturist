import createPersistedState from 'use-persisted-state';
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import { useEffect } from "react";

import "@fortawesome/fontawesome-free/css/all.css";
import 'react-loading-skeleton/dist/skeleton.css'
import "bootstrap/dist/css/bootstrap.min.css";

const useToken = createPersistedState('token');

function MyApp({ Component, pageProps }: AppProps) {
  const [token, setToken] = useToken<string>("");

  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      <Toaster />
      <Component {...pageProps} token={token} setToken={setToken} />
    </>
  );
}

export default MyApp;
