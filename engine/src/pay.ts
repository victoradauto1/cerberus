import Config from "./config";
import {getCustomerNextPayment, getCustomers, pay} from "commons/services/cerberusPayService"
import usersRepository from "./repositories/usersRepository";
import { Status } from "commons/models/status";
import sendMail from "./services/"

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
          await pay(customerAddress);
        } catch (error) {
          const user = await usersRepository.updateUserStatus(customerAddress, Status.BLOCKED);
          if(!user) continue;

          await sendmail
        }
    }

}

export default () => {
  setInterval(executionCylce, Config.CHARGE_INTERVAL);

  executionCylce();

  console.log("Cerberus Pay started.");
};
