"use client";

import React from "react";

// components

import AdminNavbar from "@/components/Navbars/AdminNavbar";
import HeaderStats from "@/components/Headers/HeaderStats";
import SideBar from "@/components/Sidebar/Sidebar";
import FooterAdmin from "@/components/Footers/FooterAdmin"
import CardLineChart from "@/components/Cards/CardLineChart";
import CardBarChart from "@/components/Cards/CardBarChart";
import CardTopPools from "@/components/Cards/CardTopPools";
import CardSocialTraffic from "@/components/Cards/CardSocialTraffic";

export default function Dashboard() {
  return (
    <>
      <SideBar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar pageName="Dashboard"/>
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardLineChart />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardBarChart />
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardTopPools />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardSocialTraffic />
            </div>
          </div>
          <FooterAdmin/>
        </div>
      </div>
    </>
  );
}

