import Websocket, { WebSocketServer } from "ws";
import Config from "./config";
import { IncomingMessage } from "http";

let wss: CerberusWSS | undefined;

class CerberusWS extends Websocket {
  id: string;

  constructor(address: string) {
    super(address);
    this.id = "";
  }
}

class CerberusWSS extends WebSocketServer {
  isConnected(userId: string): boolean {
    if (!this.clients || !this.clients.size) return false;
    return ([...this.clients] as CerberusWS[]).some((c) => c.id === userId);
  }

  getConnections(): string[] {
    if (!this.clients || !this.clients.size) return [];
    return ([...this.clients] as CerberusWS[]).map((c) => c.id);
  }

  direct(userId: string, jsonObj: Object) {
    if (!this.clients || !this.clients.size) return;
    ([...this.clients] as CerberusWS[]).forEach((client) => {
      if (client.id === userId && client.readyState === Websocket.OPEN) {
        client.send(JSON.stringify(jsonObj));
        return;
      }
    });
  }

  broadcast(jsonObj: Object) {
    if (!this.clients || !this.clients.size) return;

    ([...this.clients] as CerberusWS[]).forEach((client) => {
      if (client.readyState === Websocket.OPEN) {
        client.send(JSON.stringify(jsonObj));
      }
    });
  }
}

function verifyClient(info: any, callBack: Function) {
  return callBack(true);
}

export default (): CerberusWSS => {
  if (wss) return wss;

  wss = new CerberusWSS({
    port: Config.WS_PORT,
    verifyClient,
  });

  wss.on("connection", (ws: CerberusWS, req: IncomingMessage) => {
    if (!req.url) return;

    ws.id = req.url; //to do: implementar segurança no futuro
    ws.on("mesage", (data) => console.log(data));
    ws.on("error", (err) => console.error(err));
    console.log("ws.onConnection: " + req.url);
  });

  console.log(`Cerberus Websocket Server is running.`);
  return wss;
};
