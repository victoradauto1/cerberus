import axios from "axios";
import config from "../config";
import { PoolData } from "./uniswapTypes";

export async function getTopPools(count: number = 20,  skip:number = 0): Promise<PoolData[]>{

}