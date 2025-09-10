"use client";

import FooterAdmin from "@/components/Footers/FooterAdmin";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useRouter } from "next/navigation";
import AutomationRow from "./AutomationRow";
import { useEffect, useState } from "react";
import Automation from "commons/models/automation";
import { getAutomations } from "@/services/AutomationService";

export default function Automations() {

  const [automations, setAutomations] = useState<Automation[]>();
  const [ reload, setReload] = useState<number>(0);
  const {push} = useRouter();

  function btnNewAutomationClick(){
    push("/automations/new")
  }

  useEffect(()=>{
    getAutomations(1, 100)
      .then(automations => setAutomations(automations))
      .catch(err=> alert(err.response? JSON.stringify(err.response.data): err.message))
  },[reload])

  return (
    <>
      <Sidebar />
      <div className=" relative md:ml-64 bg-blueGray-100">
        <AdminNavbar pageName="Automations" />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24 ">
          <div className="flex flex-wrap my-4">
            <div className="w-full mb-12 px-4">
              <div
                className={
                  "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
                }
              >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 bg-black">
                      <button
                        className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 absoute right-0"
                        type="button"
                        onClick={btnNewAutomationClick}
                      >
                        New Automation
                      </button>
                    </div>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto mt-8">
                  {/* Projects table */}
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th
                          className={
                            "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                          }
                        >
                          Automation
                        </th>
                        <th
                          className={
                            "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                          }
                        >
                          Position
                        </th>
                        <th
                          className={
                            "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                          }
                        >
                          Status
                        </th>
                        <th
                          className={
                            "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                          }
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {automations && automations.length?
                      automations.map(a=> <AutomationRow data={a} onUpdate={()=> setReload(Date.now())} />)
                    : 
                    (<tr>
                      <td colSpan={4} className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        0 automations found. Create one first.
                      </td>
                    </tr>)
                    }
                    </tbody>
                  </table>
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
