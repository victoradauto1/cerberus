import { Controller, Post, Headers, Get, Param, Patch, Body } from "@nestjs/common";
import { UserService } from "./use.service";
import { UserDTO } from "./user.dto";

@Controller("users")
export class UserController{

    constructor(private readonly userService: UserService){

    }

    @Post("pay")
    async pay(@Headers("Authorization") authorization){
        //to do: token decode

        return this.userService.payUSer("");
    }

    @Get(":identifier")
    async getUser(@Headers("Authorization") authorization, @Param("identifier")identifier: string ){
        //to do: token decode

        if(identifier.startsWith("0x")){
            //to do:JWT vs identifier

            return this.userService.getUserByWallet(identifier);
        } else{
            //to do:JWT vs identifier

            const user =  await this.userService.getUserById(identifier);
            user.privateKey = "";

            return user;
        }
    }

    @Patch(":id")
    async updateUser( @Headers("Authorization") authorization, @Param("id") id: string, @Body() user: UserDTO){

        //to do: token decode
        //to do:JWT vs id

        return this.userService.updateUser(id, user);

    }
}