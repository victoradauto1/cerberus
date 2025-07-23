"use client";

import React from "react";

import CardTable from "@/components/Cards/CardTable";
import Sidebar from "@/components/Sidebar/Sidebar";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import FooterAdmin from "@/components/Footers/FooterAdmin";

export default function Automations() {
  return (
    <>
      <Sidebar />
      <div className=" relative md:ml-64 bg-blueGray-100">
        <AdminNavbar pageName="Automations"/>
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24 "></div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full mb-12 px-4">
            <CardTable />
          </div>
          <FooterAdmin/>
        </div>
      </div>
    </>
  );
}
