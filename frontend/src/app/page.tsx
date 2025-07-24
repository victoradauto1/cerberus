"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FooterSmall from "../components/Footers/FooterSmall.js";
import Navbar from "../components/Navbars/AuthNavbar.js";
import { doLogin } from "../services/Web3Services";
import { Status } from "commons/models/status";

export default function Login() {
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  function btnLoginClick() {
    setMessage("...Logging ...wait");
    doLogin()
      .then((jwt) => {
        if (!jwt) return;

        if (jwt.status == Status.ACTIVE) {
          router.push("/dashboard");
        } else if (jwt.status === Status.BLOCKED) {
          router.push("/pay" + jwt.address);
        } else if (jwt.status === Status.NEW) {
          router.push("/register/activate?wallet" + jwt.address);
        } else if (jwt.status === Status.BANNED) {
          router.push("/");
        } else {
          router.push("/register")
        }
      })
      .catch((err) => setMessage(err.message));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
            }}
          ></div>
          <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-100 lg:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="flex content-center items-center justify-center mb-5">
                      <img src="/img/cerberus.png" width={128} />
                    </div>
                    <div className="text-center mb-3">
                      <h6 className="text-blueGray-500 text-sm font-bold">
                        Sign in with your MetaMask and and start bot trading
                        today
                      </h6>
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 mt-5 inline-flex items-center"
                        type="button"
                        onClick={btnLoginClick}
                      >
                        <img
                          src="/img/metamask.svg"
                          alt="login MetaMask"
                          width={64}
                        />
                        <span>Click to connect</span>
                      </button>
                      <div>{message}</div>
                    </div>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                  </div>
                </div>
                <div className="flex flex-wrap mt-6 relative">
                  <div className="mx-auto text-right">
                    <Link href="/register" className="text-blueGray-200">
                      <small>Create new account</small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
