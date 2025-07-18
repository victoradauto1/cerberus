"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import FooterSmall from "../../../components/Footers/FooterSmall.js";
import Navbar from "../../../components/Navbars/AuthNavbar.js";
import {User} from "commons/models/user.js"
import { Status } from "commons/models/status.js";
import { ChainId } from "commons/models/chainId.js";
import { Plan } from "commons/models/plan.js"

export default function Pay() {
  const router = useRouter();
  const params = useParams();

  const wallet: string = Array.isArray(params.wallet)
    ? params.wallet[0]
    : params.wallet ?? "";

  const [user, setUser] = useState<User>({} as User);
  const [plan, setPlan] = useState<Plan>({} as Plan);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setUser({
      //carregar dados do usuário do banco
      name: "Victor",
      email: "contato@victor.com",
      status: Status.BLOCKED,
      address: wallet,
      planId: "Gold",
      network: ChainId.POLYGON_AMOY,
      activateCode: "123456",
      activateDate: new Date
    });

    // carregar dados do plano
    setPlan({
      name:"Gold",
      id:"Gold",
      tokenSymbol:"WPOL",
      tokenAddress:"0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      price:"0.001",
      maxAutomations: 10
    });
  }, [wallet]);

  function btnPayClick() {
    router.push("/dashboard");
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
                        Below is your plan detalis.
                      </h6>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          User
                        </label>
                        <div>
                          {user.name}
                          <br />
                          {user.address}
                        </div>
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Plan
                        </label>
                        <select
                          id="planId"
                          value={plan.id}
                          onChange={(evt) =>
                            setPlan({ ...plan, id: evt.target.value })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value={plan.id}>Gold</option>
                        </select>
                      </div>

                      <div className="mt-3">
                        This plan costs <strong>{plan.tokenSymbol}{plan.price}/mo.</strong> and gives you full acess to our plataform and <strong>{plan.maxAutomations}</strong> automations.
                      </div>
                      <div>
                        Your last payment was: <strong>Never</strong>
                      </div>
                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                          type="button"
                          onClick={btnPayClick}
                        >
                          PAY NOW
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
