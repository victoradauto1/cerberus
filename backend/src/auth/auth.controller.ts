import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  
    @Post('singin')
    singin(){

    }

    @Post('singup')
    singup(){

    }

   @Post('activate')
   activate(){

   }
}
