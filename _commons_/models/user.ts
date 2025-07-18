import { ChainId } from "./chainId";
import { Status } from "./status";

export type User = {
    id?: string;
    address: string;
    email: string;
    name:string;
    status: Status;
    network: ChainId;
    planId: string;
    activateCode: string;
    activateDate: Date;

}