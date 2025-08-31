"use client";

import { searchPool } from "@/services/PoolService";
import Pool from "commons/models/pool";
import React, { useEffect, useState } from "react";

type Props = {
  poolId: string | null;
  symbol: string;
  onChange: (pool: Pool | undefined) => void;
  onError: (msg: string) => void;
};

function FeeInput(props: Props) {
  const [pools, setPools] = useState<Pool[]>([]);

  function onFeeChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    if (evt.target.value === "0") return;
    props.onChange(pools.find((p) => p.id === evt.target.value));
  }

  useEffect(()=>{
    searchPool(props.symbol)
        .then(pools => setPools(pools))
        .catch(err => props.onError(err.response? JSON.stringify(err.reponse.data) : err.message))
  },[props.symbol])

  return (
    <>
      <label
        htmlFor="fee"
        className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
      >
        Fee
      </label>
      <select
        name="fee"
        id="fee"
        value={props.poolId || ""}
        onChange={onFeeChange}
        className="bg-gray-50 border border-gray-300 w-full text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="0">Select...</option>
        {pools.map((p) => (
          <option id={p.id} value={p.id}>
            {p.fee / 10000}%
          </option>
        ))}
      </select>
    </>
  );
}

export default FeeInput;
