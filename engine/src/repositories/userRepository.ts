import { Status } from "commons/models/status";
import connect from "./db";

async function updateUserStatus(address: string, status: Status) {
  const db = await connect();

  const update = await db.users.update({});
}
