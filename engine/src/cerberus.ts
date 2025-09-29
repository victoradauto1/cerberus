import Automation from "commons/models/automation";
import Pool from "commons/models/pool";
import automationsRepository from "./repositories/automationsRepository";
import usersRepository from "./repositories/usersRepository";
import { swap } from "commons/services/uniswapService";
import sendMail from "./services/mailService";

function evalCondition(automation: Automation, pool: Pool): boolean {
  return false;
}

export default async (pool: Pool): Promise<void> => {
  const automations = await automationsRepository.searchAutomations(pool.id);
  if (!automations || !automations.length) return;

  console.log(`${automations.length}} automations found`);

  automations.map(async (automation) => {
    const isValid = evalCondition(automation, pool);
    if (!isValid) return;

    console.log(`${automation.name} fired!`);

    const user = await usersRepository.getUserById(automation.userId);
    if (!user || !user.privateKey) return;

    console.log(`${user.email} will swap.`);

    try {
      const amountOut = await swap(user, automation, pool);
      automation.isOpened = !automation.isOpened;
      automation.nextAmount = amountOut;
         //registrar o trade
    } catch (error: any) {
        console.error(`Cannot swap. AutomationId: ${automation.id}`);
        automation.isActive = false;

        await sendMail(
          user.email,
          "Cerberus - automation error",
          `
                  Hi, ${user.name}
                  
                  your automation was stopped due a swap error.Tx id:

                  ${error.message}
      
                  See ya!
      
                  Admin
                  `
        );

        await automationsRepository.updateAutomation(automation);
    }
  });
};
