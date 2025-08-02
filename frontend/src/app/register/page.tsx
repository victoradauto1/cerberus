"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {getWallet} from "@/services/Web3Services.js"

import FooterSmall from "../../components/Footers/FooterSmall.js";
import Navbar from "../../components/Navbars/AuthNavbar.js";
import { signUp } from "@/services/AuthService.js";
import { User } from "commons/models/user.js";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies.js";

type newUser = {
    name: string,
    email: string
}

export default function Register() {
  
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<newUser>({
    name: "",
    email:"",
  });

  const router = useRouter();

  async function register () {
    setMessage("Saving... Wait...")
    router.push("/regi ster/activate");

    let wallet = localStorage.getItem("wallet");
    if(!wallet){
      try{
        wallet = await getWallet();
      }catch(err:any){
        setMessage(err.message);
        return;
      }
      
    }

   try {
     await signUp({
      name: user.name,
      address: wallet,
      email: user.email,
      planId: "Gold"
    } as User)

    router.push("/register/activate?wallet"+ wallet)
   } catch (err: any) {
    setMessage(err.response? JSON.stringify(err.response.data): err.message)
   }
  }

  function btnSaveClick() {
    register();
  }

  function onUserChange(evt: React.ChangeEvent<HTMLInputElement>){
    setUser((prevState: any)=> ({...prevState, [evt.target.id]: evt.target.value}))
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
                        Sign up filling up the form bellow. Your MetaMask will
                        prompt to save.
                      </h6>
                    </div>
                    <form>
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Name"
                            value={user&& user.name}
                            onChange={onUserChange}
                          />
                        </div>

                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Email"
                            value={user&& user.email}
                            onChange={onUserChange}
                          />
                        </div>
                        <div className="text-center mt-6">
                          <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                            type="button"
                            onClick={btnSaveClick}
                          >
                            Create account
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
