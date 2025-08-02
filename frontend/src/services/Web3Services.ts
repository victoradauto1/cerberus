import { JWT } from "commons/models/jwt";
import { BrowserProvider } from "ethers";
import ConfigService from "./ConfigService";
import { Status } from "commons/models/status";
import { Plan } from "commons/models/plan";
import { Contract } from "ethers";
import ERC20_ABI from "commons/services/ERC20.json"
import { Auth, parseJwt, signIn } from "./AuthService";

function getProvider() {
  if (!window.ethereum) throw new Error("No Metamsk found!");
  return new BrowserProvider(window.ethereum);
}

export async function getWallet(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);

  if(!accounts || !accounts.length) throw new Error("Metamask not allowed!");

  const wallet = accounts[0];
  localStorage.setItem("wallet", wallet);

  return  wallet;
}

export async function doLogin(): Promise<JWT | undefined> {
  const timestamp = Date.now();
  const message = ConfigService.getAuthMsg();
  const wallet = await getWallet();
  const provider = getProvider();
  const signer = await provider.getSigner();

  const challenge = await signer.signMessage(message);

  const token =  await signIn({
    secret: challenge,
    timestamp,
    wallet
  } as Auth)

  localStorage.setItem("token", token);
 console.log(token);

  return parseJwt(token);

}
export async function startPayment(plan: Plan): Promise<boolean>{
  const provider = getProvider();
  const signer = await provider.getSigner();
  const tokenContract = new Contract(plan.tokenAddress, ERC20_ABI, signer );
  const tx = await tokenContract.approve(ConfigService.CERBERUS_PAY_CONTRACT, BigInt(plan.price)* 12n );
  tx.wait();
  return true;
}
