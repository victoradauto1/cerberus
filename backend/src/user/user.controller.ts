import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('pay')
  async pay(@Headers('Authorization') authorization) {
    const jwt = this.authService.decodeToken(authorization);

    return this.userService.payUSer(jwt.address);
  }

  @UseGuards(AuthGuard)
  @Get(':identifier')
  async getUser(
    @Headers('Authorization') authorization,
    @Param('identifier') identifier: string,
  ) {
    const jwt = this.authService.decodeToken(authorization);

    if (identifier.startsWith('0x')) {
      if (identifier.startsWith('0x')) {
        if (jwt.address.toUpperCase() !== identifier.toUpperCase())
          throw new ForbiddenException();
        return this.userService.getUserByWallet(identifier);
      }
    } else {
      if (jwt.address.toUpperCase() !== identifier.toUpperCase())
        throw new ForbiddenException();
      const user = await this.userService.getUserById(identifier);
      user.privateKey = '';
      return user;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Headers('Authorization') authorization,
    @Param('id') id: string,
    @Body() user: UserDTO,
  ) {
    const jwt = this.authService.decodeToken(authorization);
    if (jwt.address.toUpperCase() !== id.toUpperCase())
      throw new ForbiddenException();
    return this.userService.updateUser(id, user);
  }
}
