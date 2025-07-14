"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import FooterSmall from "../../../components/Footers/FooterSmall.js";
import Navbar from "../../../components/Navbars/AuthNavbar.js";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config.js";

export default function Activate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState<string>("");
  const [code, setCode] = useState<string>(searchParams.get("code") || "");
  const [wallet, setWallet] = useState<string>(searchParams.get("wallet") || "");

  useEffect(() => {
    if (code &&  code.length === 6 && wallet) {
      console.log(code, wallet);
      router.push("/pay");
    }
  }, [code, wallet]);

  function btnActivateClick() {
    router.push("/pay");
  }

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
                        We sent you a code by email right now. Fill bellow thew
                        six numbers.
                      </h6>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Code
                        </label>
                        <input
                          type="number"
                          id="code"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="000000"
                          value={code}
                          onChange={(evt) => setCode(evt.target.value)}
                        />
                      </div>
                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                          type="button"
                          onClick={btnActivateClick}
                        >
                          Activate account
                        </button>
                        <div>{message}</div>
                      </div>
                    </form>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                  </div>
                </div>
                <div className="flex flex-wrap mt-6 relative">
                  <div className="mx-auto text-right">
                    <Link href="/" className="text-blueGray-200">
                      <small>Do you have an account? Go back to login</small>
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
