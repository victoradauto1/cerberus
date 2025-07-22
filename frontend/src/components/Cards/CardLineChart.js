"use client";

import React, { useEffect, useRef } from "react";

const CardLineChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      interval: "60",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: "NASDAQ:AAPL",
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0F0F0F",
      gridColor: "rgba(242, 242, 242, 0.06)",
      width: "100%",
      height: "100%",
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Overview
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Sales value
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative w-full h-[400px] tradingview-widget-container">
          <div
            ref={containerRef}
            className="tradingview-widget-container__widget w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CardLineChart;