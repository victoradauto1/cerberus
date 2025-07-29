import { Controller,Body, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/use.service';
import {User} from 'commons/models/user'

@Controller('auth')
export class AuthController {

    constructor(
         private readonly userService: UserService
    ){
        
    }
  
    @Post('singin')
    singin(@Body() data: AuthDTO): object{

        return data;
    }

    @Post('singup')
    async singup(@Body() data: UserDTO):Promise <User>{

        const user = await this.userService.addUser(data);

        // to do: enviar email de confirmação

        
        return user;

    }

   @Post('activate/:wallet/:code')
   async activate(@Param("wallet")wallet: string, @Param("code") code: string ): Promise<string>{

    const user =  await this.userService.activateUser(wallet, code);

    // to do: enviar email boas vindas

    // to do: gerar JWT
    return "jwt";
   }
}
