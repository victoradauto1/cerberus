import Pool from "commons/models/pool";
import automationsRepository from "./repositories/automationsRepository";
import Automation from "commons/models/automation";

function evalCondition(automation: Automation, pool: Pool): boolean{
    return false;
}

export default async (pool:Pool): Promise<void>=>{

    const automations = await  automationsRepository.searchAutomations(pool.id);
    if(!automations || !automations.length) return;

    console.log(`${automations.length}} automations found`);

    automations.map(async (automation)=>{
        const isValid = evalCondition(automation, pool);
        if(!isValid) return;
    })

    //testar as condições delas

    //fazer o swap

    //atualizar a automação

    //registrar o trade
}