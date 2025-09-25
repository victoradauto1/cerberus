import Config from "./config";
import {getCustomerNextPayment, getCustomers, pay} from "commons/services/cerberusPayService"
import usersRepository from "./repositories/usersRepository";
import { Status } from "commons/models/status";
import sendMail from "./services/mailService"
import automationsRepository from "./repositories/automationsRepository";

async function executionCylce() {
    console.log("Executing the payment cycle...");

    const customers = await getCustomers();
    console.log(customers.length + "customers loaded!");

    for (let i = 0; i < customers.length; i++){
        const customerAddress = customers[i].toLocaleLowerCase();
        if(/^(0x0+)$/.test(customerAddress)) continue;

        const nextPayment = await getCustomerNextPayment(customerAddress);
        if(nextPayment > (Date.now()/1000)) continue;

        let user;

        try {
          console.log("Chrging customer "+ customerAddress)
          await pay(customerAddress);
          user = await usersRepository.updateUserStatus(customerAddress, Status.ACTIVE);
          if(!user) continue;

          await automationsRepository.startAutomations(user.id!);
        } catch (error) {
          const user = await usersRepository.updateUserStatus(customerAddress, Status.BLOCKED);
          if(!user) continue;

          await automationsRepository.stopAutomations(user.id!);

          await sendMail(user.email, "Cerberus account blocked", `
            Hi, ${user.name}
            
            your account was blocked due to insufficient balance or allawance. Please, click in the link below (or copy-paste in the browser) to update your paument info:

            ${Config.SITE_URL}/pay/${user.address}

            See ya!

            Admin
            `);
        }
    }

    console.log("Finished the payment cycle.")
}

export default () => {
  setInterval(executionCylce, Config.CHARGE_INTERVAL);

  executionCylce();

  console.log("Cerberus Pay started.");
};
