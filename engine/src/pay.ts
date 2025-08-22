import Config from "./config";
import {getCustomerNextPayment, getCustomers, pay} from "commons/services/cerberusPayService"
import usersRepository from "./repositories/usersRepository";
import { Status } from "commons/models/status";
import sendMail from "./services/mailService"

async function executionCylce() {
    console.log("Executing the payment cycle...");

    const customers = await getCustomers();
    console.log(customers.length + "customers loaded!");

    for (let i = 0; i < customers.length; i++){
        const customerAddress = customers[0];
        if(/0x0+/.test(customerAddress)) continue;

        const nextPayment = await getCustomerNextPayment(customerAddress);
        if(nextPayment > (Date.now()/1000)) continue;

        try {
          console.log("Chrging customer "+ customerAddress)
          await pay(customerAddress);
        } catch (error) {
          const user = await usersRepository.updateUserStatus(customerAddress, Status.BLOCKED);
          if(!user) continue;

          await sendMail(user.email, "Cerberus account blocked", `
            Hi, ${user.name}
            
            your account was blocked due to insufficient balance or allawance. Please, click in the link below (or copy-paste in the browser) to update your paument info:

            ${Config.SITE_URL}/pay/${user.address}

            See ya!

            Admin
            `);

            // to do: bloquear as automações
        }
    }

}

export default () => {
  setInterval(executionCylce, Config.CHARGE_INTERVAL);

  executionCylce();

  console.log("Cerberus Pay started.");
};
