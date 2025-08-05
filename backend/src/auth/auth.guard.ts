/*istanbul ignore file */
import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private readonly authService: AuthService){

    }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authorization = context.switchToHttp().getRequest().headers;
    return !!this.authService.checkToken(authorization || "");
  }
}
