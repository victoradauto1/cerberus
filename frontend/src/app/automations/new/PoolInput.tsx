"use client";

import Pool from "commons/models/pool";
import { useState } from "react";

type Props = {
  poolId: string | null;
  onError: (msg: string) => void;
  onChange: (pool: Pool | null) => void;
};

export type SelectOption = {
  value: string;
  label: string;
};

function PoolInput(props: Props) {
  const [symbol, setSymbol] = useState<string>("");
  const [symbols, setSymbols] = useState<SelectOption[]>();

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-3/12 px-4">
          <div className="relative w-full mb-3">
            <label
              htmlFor="network"
              className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
            >
              Network
            </label>
            <input
              type="text"
              id="network"
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value="Polygon"
              disabled={true}
            />
          </div>
        </div>
        <div className="w-full lg:w-3/12 px-4">
          <div className="relative w-full mb-3">
            <label
              htmlFor="exchange"
              className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
            >
              Exchange
            </label>
            <input
              type="text"
              id="exchange"
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value="Uniswap v3"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PoolInput;
