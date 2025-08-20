import { Status } from "commons/models/status";
import {User} from "commons/models/user";
import connect from "./db";

async function updateUserStatus(address: string, status: Status): Promise<User> {
  const db = await connect();

  const user = await db.users.update({
    where: {address},
    data: {status}
  });

  return user;
}

export default {
  updateUserStatus
}
