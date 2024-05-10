import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Login } from './entities/login.entity';
import { CurrentMatches } from './entities/current-matches.entity';
import { AuthenticationsService } from './login.service';

@Controller("/authentications")
export class AuthenticationsController {
  constructor(private readonly loginService: AuthenticationsService) {}

  @Post("/login")
  login(
    @Body() login: Login
  ): CurrentMatches {
    //attaches SESSION_TOKEN cookie open token object with user_id
    //also returns current open matches
    return 
  }

  @Post("/logout")
  logout(
  ): string {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    return ""
  }
}
