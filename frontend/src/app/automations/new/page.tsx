"use client";

import Alert from "@/components/Alert";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Automation from "commons/models/automation";
import { ChainId } from "commons/models/chainId";
import { Exchange } from "commons/models/exchange";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import RadioGroup from "@/components/RadioGroup";
import PoolInput from "./PoolInput";
import Pool from "commons/models/pool";


export default function newAutomation() {
  const { push } = useRouter();

  const queryString = useSearchParams();

  const automationId = queryString.get("id");

  const DEFAULT_AUTOMATION = {
    isOpened: false,
    isActive: false,
    network: ChainId.POLYGON_MAINNET,
    exchange: Exchange.Uniswap,
  } as Automation;

  const [automation, setAutomation] = useState<Automation>(DEFAULT_AUTOMATION);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pool, setPool]= useState<Pool>({} as Pool);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!automationId) return;
    //carregar a automação
  }, [automationId]);

  function onAutomationChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setAutomation((previousState: any) => ({
      ...previousState,
      [evt.target.id]: evt.target.value,
    }));
  }

  function btnSaveClick() {

    if(!automation.name){
      setError("The automation name is required.");
      return;
    }

    if(!automation.poolId){
      setError("The automation pool is required.");
      return;
    }

    if (
      !confirm(
        "This action will use some wey ( 'aprove' function). Are you sure?"
      )
    )
      setError("");
    setIsLoading(true);
    alert(JSON.stringify(automation));
    //slavar a automação
  }

  function onPoolChange(pool: Pool | null){
   setAutomation((prevState: any)=>({...prevState, poolId: pool? pool.id : null}));
   setPool(pool || {} as Pool);
  }

  return (
    <>
      <Sidebar />
      <div className=" relative md:ml-64 bg-blueGray-100">
        <AdminNavbar pageName="Automatios" />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24 ">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      {automationId ? "Edit" : "New"}
                      New Automation
                    </h6>
                    <button
                      className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={btnSaveClick}
                    >
                      {isLoading ? "Saving" : "Save Automation"}
                    </button>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  {error && <Alert isError={!!error} message={error} />}
                  <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      General
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="name"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            id="name"
                            defaultValue={automation.name || ""}
                            onChange={onAutomationChange}
                          />
                        </div>
                      </div>
                    </div>

                    <RadioGroup id="isActive" textOn="Automation On" textOff="Automation Off" isOn={automation.isActive} onChange={onAutomationChange}/>
                    <div className="mt-3">
                      <RadioGroup id="isOpened" textOn="Is Opened" textOff="Is Closed" isOn={automation.isOpened} onChange={onAutomationChange}/>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Pool
                    </h6>

                    <PoolInput poolId={automation.poolId} onError={setError} onChange={onPoolChange} />

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Strategy
                    </h6>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="nextAmount"
                        >
                          Trade Amount
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          id="nextAmount"
                          defaultValue={automation.nextAmount || "0"}
                          onChange={onAutomationChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
