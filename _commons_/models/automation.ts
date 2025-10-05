import { threadId } from "worker_threads";
import { ChainId } from "./chainId";
import { Exchange } from "./exchange";

export type Condition = {
  field: string;
  operator: string;
  value: string;
};

export default class Automation {
  id?: string;
  userId: string;
  name: string;
  exchange: Exchange;
  network: ChainId;
  poolId: string | null;
  openCondition: Condition;
  closeCondition: Condition | null;
  isOpened: boolean;
  isActive: boolean;
  nextAmount: string;
  pnl?: number;
  tradeCount?: number;

  constructor(automation: Automation) {
    this.id = automation.id;
    this.userId = automation.userId;
    this.name = automation.name;
    this.exchange = automation.exchange || Exchange.Uniswap;
    this.network = automation.network || ChainId.POLYGON_MAINNET;
    this.poolId = automation.poolId;
    this.openCondition = automation.openCondition;
    this.closeCondition = automation.closeCondition;
    this.isOpened = automation.isOpened === true;
    this.isActive = automation.isActive === true;
    this.nextAmount = automation.nextAmount;
    this.pnl = automation.pnl || 0;
    this.tradeCount = automation.tradeCount || 0;
  }
}
