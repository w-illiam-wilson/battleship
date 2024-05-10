import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Login } from './entities/login.entity';
import { CurrentMatches } from './entities/current-matches.entity';
import { AuthenticationsService } from './authentications.service';

@Controller("/authentications")
export class AuthenticationsController {
  constructor(private readonly loginService: AuthenticationsService) {}

  @Post("/login")
  async login(
    @Body() login: Login,
    @Res({ passthrough: true }) response: Response
  ): Promise<CurrentMatches> {
    return await this.loginService.login(login, response);
  }

  @Post("/logout")
  logout(
  ): string {
    //clears SESSION_TOKEN and invalidates session id on ticket server
    return ""
  }
}
