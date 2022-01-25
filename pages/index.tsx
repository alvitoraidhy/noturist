import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Head from "next/head";

import HomeForm from "../components/HomeForm";
import Footer from "../components/Footer";

import type { Dispatch, SetStateAction } from "react";
import type { NextPage } from "next";

type Props = {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

const Home: NextPage<Props> = ({ token, setToken }) => {
  const router = useRouter();

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token]);

  return (
    <>
      <Head>
        <title>Noturist - Manage your notes on the cloud</title>
        <meta name="description" content="Manage your notes on the cloud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-vh-100 d-flex flex-column bg-light">
        <main className="container px-3 py-5 mt-auto">
          <div className="row g-4">
            <div className="col-sm-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <Image
                alt="Manage notes"
                src="/assets/images/undraw_personal_notebook_re_d7dc.svg"
                width="300px"
                height="300px"
              />
              <h1 className="text-center">Noturist</h1>
            </div>
            <div className="col-sm-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card p-3 shadow border-0">
                <div className="card-body">
                  <h2 className="card-title">Log In</h2>
                  <p className="card-text">
                    It seems that you are not logged in yet. Please log in to
                    view, add, edit, or remove your notes.
                  </p>
                  <hr />
                  <HomeForm setToken={setToken} />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
