import { Injectable } from '@nestjs/common';
import { AutomationDTO } from './automation.dto';
import Automation from "commons/models/automation";
import db from "../db";

@Injectable()
export class AutomationService {
  async addAutomation(userId: string, automation: AutomationDTO): Promise<Automation> {
    return db.automations.create({
      data:{
        exchange: automation.exchange,
        network: automation.network,
        openCondition: automation.openCondition,
        closeCondition: automation.closeCondition,
        isActive: automation.isActive || false,
        isOpened: automation.isOpened || false,
        name: automation.name,
        nextAmount: automation.nextAmount,
        poolId: automation.poolId,
        userId
      }
    })
  }
}
