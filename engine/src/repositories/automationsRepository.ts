import Automation from "commons/models/automation";
import connect from "./db";

async function getAutomation(
  id: string,
  userId: string
): Promise<Automation | null> {
  const db = await connect();
  return db.automations.findUnique({
    where: { id, userId },
  });
}
