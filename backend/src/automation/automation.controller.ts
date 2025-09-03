import { Controller } from "@nestjs/common";
import { PoolService } from "../pool/pool.service";
import { UserService } from "../user/user.service";
import { AuthService } from "../auth/auth.service";
import { AutomationService } from "./automation.service";


@Controller("automations")
export class AutomationController{

    constructor (
        private readonly automationService: AutomationService,
        private readonly poolService: PoolService,
        private readonly userService: UserService,
        private readonly authService: AuthService
    ){

    }
}