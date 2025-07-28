import { Controller,Body, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { Wallet } from 'ethers';

@Controller('auth')
export class AuthController {
  
    @Post('singin')
    singin(@Body() data): object{
        return data;
    }

    @Post('singup')
    singup(@Body() data):object{
        return data;

    }

   @Post('activate/:wallet/:code')
   activate(@Param("wallet")wallet: string, @Param("code", ParseIntPipe) code: number ): object{
    return {
        wallet,
        code
    }
   }
}
